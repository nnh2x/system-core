import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Space } from 'antd';
import {
  TeamOutlined,
  SafetyOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import { rbacService } from '@/services/rbac.service';
import { licenseService } from '@/services/license.service';
import { entitlementService } from '@/services/entitlement.service';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    roles: 0,
    subscriptions: 0,
    entitlements: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, roles, subscriptions, entitlements] = await Promise.all([
          userService.getAll(),
          rbacService.getRoles(),
          licenseService.getSubscriptions(),
          entitlementService.getEntitlements(),
        ]);

        setStats({
          users: users.length,
          roles: roles.length,
          subscriptions: subscriptions.length,
          entitlements: entitlements.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1>Welcome back, {user?.firstName}!</h1>
      <p style={{ color: '#888', marginBottom: 24 }}>
        Organization: {user?.organization?.name}
      </p>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.users}
              prefix={<TeamOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Roles"
              value={stats.roles}
              prefix={<SafetyOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Subscriptions"
              value={stats.subscriptions}
              prefix={<ShoppingOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Feature Entitlements"
              value={stats.entitlements}
              prefix={<CheckCircleOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Quick Actions" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <p>• Manage users and assign roles</p>
              <p>• Configure subscription plans and features</p>
              <p>• Monitor feature usage and entitlements</p>
              <p>• Generate and validate license keys</p>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
