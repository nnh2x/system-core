import React, { useCallback, useEffect, useState } from 'react';
import {
    Table,
    Button,
    Checkbox,
    Drawer,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    message,
    Switch,
    Tag,
    Tooltip,
} from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { SubscriptionPlan, PlanType } from '@/types';
import { licenseService } from '@/services/license.service';
import type { ColumnsType } from 'antd/es/table';

// Only the fields the user can edit — excludes server-managed fields (id, createdAt, features…)
type PlanFormValues = {
    name: string;
    planType: PlanType;
    description?: string;
    price: number;
    billingCycle: string;
    maxUsers: number;
    unlimitedUsers: boolean;
    maxApiCalls: number;
    unlimitedApiCalls: boolean;
    isActive: boolean;
};

const LicensePlansPage: React.FC = () => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
    const [form] = Form.useForm<PlanFormValues>();

    const fetchPlans = useCallback(async () => {
        setLoading(true);
        try {
            const data = await licenseService.getPlans();
            setPlans(data);
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Failed to fetch plans';
            message.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleCreate = () => {
        setEditingPlan(null);
        form.resetFields();
        setDrawerVisible(true);
    };

    const handleEdit = (plan: SubscriptionPlan) => {
        setEditingPlan(plan);
        // Only set the fields the form owns — prevents server-managed fields
        // (id, createdAt, updatedAt, features…) from being sent in the update payload.
        form.setFieldsValue({
            name: plan.name,
            planType: plan.planType,
            description: plan.description,
            price: plan.price,
            billingCycle: plan.billingCycle,
            maxUsers: plan.maxUsers === -1 ? 0 : plan.maxUsers,
            unlimitedUsers: plan.maxUsers === -1,
            maxApiCalls: plan.maxApiCalls === -1 ? 0 : plan.maxApiCalls,
            unlimitedApiCalls: plan.maxApiCalls === -1,
            isActive: plan.isActive,
        });
        setDrawerVisible(true);
    };

    const handleSubmit = async (values: PlanFormValues) => {
        // Resolve the "unlimited" checkboxes back to the -1 sentinel the API expects
        const payload: Partial<SubscriptionPlan> = {
            name: values.name,
            planType: values.planType,
            description: values.description,
            price: values.price,
            billingCycle: values.billingCycle,
            maxUsers: values.unlimitedUsers ? -1 : values.maxUsers,
            maxApiCalls: values.unlimitedApiCalls ? -1 : values.maxApiCalls,
            isActive: values.isActive,
        };
        try {
            if (editingPlan) {
                await licenseService.updatePlan(editingPlan.id, payload);
                message.success('Plan updated successfully');
            } else {
                await licenseService.createPlan(payload);
                message.success('Plan created successfully');
            }
            setDrawerVisible(false);
            fetchPlans();
        } catch (error) {
            const axiosMsg = (error as any)?.response?.data?.message;
            message.error(axiosMsg || (error instanceof Error ? error.message : 'Failed to save plan'));
        }
    };

    const getPlanTypeColor = (type: PlanType) => {
        const colors: Record<PlanType, string> = {
            FREE: 'default',
            TRIAL: 'blue',
            BASIC: 'green',
            PRO: 'orange',
            ENTERPRISE: 'purple',
        };
        return colors[type];
    };

    const columns: ColumnsType<SubscriptionPlan> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Plan Type',
            dataIndex: 'planType',
            key: 'planType',
            render: (type: PlanType) => <Tag color={getPlanTypeColor(type)}>{type}</Tag>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `$${price}`,
        },
        {
            title: 'Billing Cycle',
            dataIndex: 'billingCycle',
            key: 'billingCycle',
        },
        {
            title: 'Max Users',
            dataIndex: 'maxUsers',
            key: 'maxUsers',
            render: (max: number) => (max === -1 ? 'Unlimited' : max),
        },
        // {
        //   title: 'Max API Calls',
        //   dataIndex: 'maxApiCalls',
        //   key: 'maxApiCalls',
        //   render: (max: number) => (max === -1 ? 'Unlimited' : max.toLocaleString()),
        // },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Inactive'}</Tag>
            ),
        },
        {
            title: 'Features',
            dataIndex: 'features',
            key: 'features',
            render: (features: any[]) => features?.length || 0,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: SubscriptionPlan) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h2>Subscription Plans</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    Add Plan
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={plans}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Drawer
                title={editingPlan ? 'Edit Plan' : 'Create Plan'}
                width={480}
                open={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
                            <Button type="primary" onClick={() => form.submit()}>
                                {editingPlan ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </div>
                }
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="name"
                        label="Plan Name"
                        rules={[{ required: true, message: 'Please input plan name!' }]}
                    >
                        <Input placeholder="Pro Plan" />
                    </Form.Item>

                    <Form.Item
                        name="planType"
                        label="Plan Type"
                        rules={[{ required: true, message: 'Please select plan type!' }]}
                    >
                        <Select>
                            <Select.Option value="FREE">Free</Select.Option>
                            <Select.Option value="TRIAL">Trial</Select.Option>
                            <Select.Option value="BASIC">Basic</Select.Option>
                            <Select.Option value="PRO">Pro</Select.Option>
                            <Select.Option value="ENTERPRISE">Enterprise</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea placeholder="Plan description" rows={3} />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Price ($)"
                        rules={[{ required: true, message: 'Please input price!' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} placeholder="29.99" />
                    </Form.Item>

                    <Form.Item
                        name="billingCycle"
                        label="Billing Cycle"
                        rules={[{ required: true, message: 'Please input billing cycle!' }]}
                    >
                        <Select>
                            <Select.Option value="monthly">Monthly</Select.Option>
                            <Select.Option value="yearly">Yearly</Select.Option>
                            <Select.Option value="lifetime">Lifetime</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="maxUsers"
                        label="Max Users (-1 for unlimited)"
                        rules={[{ required: true, message: 'Please input max users!' }]}
                    >
                        <InputNumber min={-1} style={{ width: '100%' }} placeholder="10" />
                    </Form.Item>

                    <Form.Item
                        name="maxApiCalls"
                        label="Max API Calls (-1 for unlimited)"
                        rules={[{ required: true, message: 'Please input max API calls!' }]}
                    >
                        <InputNumber min={-1} style={{ width: '100%' }} placeholder="10000" />
                    </Form.Item>

                    <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue={true}>
                        <Switch />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default LicensePlansPage;
