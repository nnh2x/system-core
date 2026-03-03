import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  Space,
  Tag,
  Popconfirm,
  message,
  Switch,
  Descriptions,
  Badge,
  Avatar,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { UserDetail } from '@/types';
import { userService } from '@/services/user.service';
import { rbacService } from '@/services/rbac.service';
import type { ColumnsType } from 'antd/es/table';
import { usePopup } from '@/hooks/usePopup';
import AppModal from '@/components/AppModal';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // ── Popups ──────────────────────────────────────────────────────────────
  const formPopup = usePopup<UserDetail>(); // create / edit drawer
  const detailPopup = usePopup<UserDetail>(); // view detail drawer

  // ── Data fetching ────────────────────────────────────────────────────────

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await rbacService.getRoles();
      setRoles(data);
    } catch {
      message.error('Failed to fetch roles');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleCreate = () => {
    form.resetFields();
    formPopup.openCreate();
  };

  const handleEdit = (user: UserDetail) => {
    form.setFieldsValue({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.status === 'active',
    });
    formPopup.openEdit(user);
  };

  const handleViewDetail = (user: UserDetail) => {
    detailPopup.openView(user);
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.delete(id);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (formPopup.isEditing && formPopup.currentData) {
        await userService.update(formPopup.currentData.id, values);
        message.success('User updated successfully');
      } else {
        await userService.create(values);
        message.success('User created successfully');
      }
      formPopup.close();
      fetchUsers();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to save user');
    }
  };

  // ── Table columns ────────────────────────────────────────────────────────

  const columns: ColumnsType<UserDetail> = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: any[]) => (
        <>
          {roles?.map((role) => (
            <Tag key={role.id} color="blue">
              {role.name}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: UserDetail) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ── Render ───────────────────────────────────────────────────────────────

  const detailUser = detailPopup.currentData;

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Users Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Add User
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* ── View Detail Modal ─────────────────────────────────────────── */}
      <AppModal
        popup={detailPopup}
        title={
          <Space>
            <Avatar
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            />
            <span>{detailUser?.fullName ?? 'User Detail'}</span>
          </Space>
        }
        width={560}
        footer={
          <Space>
            <Button onClick={detailPopup.close}>Close</Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                detailPopup.close();
                if (detailUser) handleEdit(detailUser);
              }}
            >
              Edit
            </Button>
          </Space>
        }
      >
        {detailUser && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Email">
              {detailUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="First Name">
              {detailUser.firstName}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {detailUser.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Full Name">
              {detailUser.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Badge
                status={detailUser.status === 'active' ? 'success' : 'error'}
                text={detailUser.status === 'active' ? 'Active' : 'Inactive'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Organization">
              {detailUser.organization?.name ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(detailUser.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {new Date(detailUser.updatedAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </AppModal>

      {/* ── Create / Edit Form Drawer ─────────────────────────────────── */}
      <Drawer
        title={formPopup.isEditing ? 'Edit User' : 'Create User'}
        width={480}
        open={formPopup.isOpen}
        onClose={formPopup.close}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={formPopup.close}>Cancel</Button>
              <Button type="primary" onClick={() => form.submit()}>
                {formPopup.isEditing ? 'Update' : 'Create'}
              </Button>
            </Space>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input placeholder="user@example.com" />
          </Form.Item>

          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please input first name!' }]}
          >
            <Input placeholder="John" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please input last name!' }]}
          >
            <Input placeholder="Doe" />
          </Form.Item>

          {!formPopup.isEditing && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
          )}

          <Form.Item
            name="isActive"
            label="Active Status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default UsersPage;
