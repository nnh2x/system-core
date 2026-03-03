import React from 'react';
import { Button, Modal, Space } from 'antd';
import type { ModalProps } from 'antd';
import type { UsePopupReturn } from '@/hooks/usePopup';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppModalProps<TData = unknown>
    extends Omit<ModalProps, 'open' | 'onCancel' | 'footer'> {
    /** Pass the return value of usePopup() directly */
    popup: UsePopupReturn<TData>;

    /** Modal content */
    children: React.ReactNode;

    // ── Footer customisation ─────────────────────────────────────────────────
    /** Hide the default footer (Cancel + primary action button) */
    hideFooter?: boolean;
    /** Label for the primary action button. Defaults to 'OK'. */
    okText?: string;
    /** Called when the primary action button is clicked */
    onOk?: () => void;
    /** Show a loading spinner on the primary action button */
    okLoading?: boolean;
    /** Completely replace the footer with custom content */
    footer?: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * `AppModal` — A wrapper around Ant Design's Modal that integrates with the
 * `usePopup` hook so you don't have to wire `open` / `onCancel` manually.
 *
 * @example — Basic view modal
 * ```tsx
 * const detailPopup = usePopup<User>();
 *
 * <Button onClick={() => detailPopup.openView(user)}>View</Button>
 *
 * <AppModal popup={detailPopup} title="User Detail" hideFooter>
 *   <p>{detailPopup.currentData?.email}</p>
 * </AppModal>
 * ```
 *
 * @example — Confirm / form modal with action button
 * ```tsx
 * const editPopup = usePopup<User>();
 *
 * <AppModal
 *   popup={editPopup}
 *   title="Edit User"
 *   okText="Save"
 *   okLoading={saving}
 *   onOk={handleSubmit}
 * >
 *   <Form ... />
 * </AppModal>
 * ```
 */
function AppModal<TData = unknown>({
    popup,
    children,
    hideFooter = false,
    okText = 'OK',
    onOk,
    okLoading = false,
    footer,
    ...modalProps
}: AppModalProps<TData>) {
    // ── Footer ───────────────────────────────────────────────────────────────

    const resolvedFooter = (() => {
        if (hideFooter) return null;
        if (footer !== undefined) return footer;

        return (
            <Space>
                <Button onClick={popup.close}>Cancel</Button>
                {onOk && (
                    <Button type="primary" loading={okLoading} onClick={onOk}>
                        {okText}
                    </Button>
                )}
            </Space>
        );
    })();

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <Modal
            open={popup.isOpen}
            onCancel={popup.close}
            footer={resolvedFooter}
            {...modalProps}
            centered={true}
            width={700}
        >
            {children}
        </Modal>
    );
}

export default AppModal;
