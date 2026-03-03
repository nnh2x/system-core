import { useCallback, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PopupMode = 'create' | 'edit' | 'view' | 'delete' | (string & {});

export interface PopupState<TData = unknown> {
    /** Whether the popup is currently visible */
    open: boolean;
    /** The current mode of the popup (create / edit / view / delete / custom) */
    mode: PopupMode;
    /** The data record associated with the popup (null when creating) */
    data: TData | null;
}

export interface UsePopupReturn<TData = unknown> {
    /** Full popup state — spread directly into Modal/Drawer `open` prop */
    popupState: PopupState<TData>;

    // ── Convenience getters ───────────────────────────────────────────────────
    /** Alias for `popupState.open` */
    isOpen: boolean;
    /** Alias for `popupState.data` */
    currentData: TData | null;
    /** True when mode === 'create' */
    isCreating: boolean;
    /** True when mode === 'edit' */
    isEditing: boolean;
    /** True when mode === 'view' */
    isViewing: boolean;
    /** True when mode === 'delete' */
    isDeleting: boolean;

    // ── Actions ───────────────────────────────────────────────────────────────
    /** Open in 'create' mode (no pre-filled data) */
    openCreate: () => void;
    /** Open in 'edit' mode with a data record */
    openEdit: (record: TData) => void;
    /** Open in 'view' mode with a data record */
    openView: (record: TData) => void;
    /** Open in 'delete' mode with a data record */
    openDelete: (record: TData) => void;
    /** Open in any custom mode, optionally with data */
    openWith: (mode: PopupMode, data?: TData | null) => void;
    /** Close the popup and reset state */
    close: () => void;
}

// ─── Default state ────────────────────────────────────────────────────────────

const DEFAULT_STATE = <TData>(): PopupState<TData> => ({
    open: false,
    mode: 'create',
    data: null,
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * `usePopup` — A generic hook for managing Modal / Drawer / Dialog state.
 *
 * @example — Basic usage
 * ```tsx
 * const popup = usePopup<SubscriptionPlan>();
 *
 * // Open in edit mode
 * <Button onClick={() => popup.openEdit(plan)}>Edit</Button>
 *
 * // Open in create mode
 * <Button onClick={popup.openCreate}>Create</Button>
 *
 * // Wire to a Drawer
 * <Drawer
 *   open={popup.isOpen}
 *   onClose={popup.close}
 *   title={popup.isCreating ? 'Create Plan' : 'Edit Plan'}
 * >
 *   <Form initialValues={popup.currentData ?? undefined} />
 * </Drawer>
 * ```
 *
 * @example — Multiple independent popups on one page
 * ```tsx
 * const createDrawer = usePopup<Plan>();
 * const deleteModal  = usePopup<Plan>();
 * ```
 */
export function usePopup<TData = unknown>(): UsePopupReturn<TData> {
    const [state, setState] = useState<PopupState<TData>>(DEFAULT_STATE<TData>);

    // ── Actions ─────────────────────────────────────────────────────────────────

    const openWith = useCallback((mode: PopupMode, data: TData | null = null) => {
        setState({ open: true, mode, data });
    }, []);

    const openCreate = useCallback(() => openWith('create', null), [openWith]);
    const openEdit = useCallback((record: TData) => openWith('edit', record), [openWith]);
    const openView = useCallback((record: TData) => openWith('view', record), [openWith]);
    const openDelete = useCallback((record: TData) => openWith('delete', record), [openWith]);

    const close = useCallback(() => {
        setState(DEFAULT_STATE<TData>());
    }, []);

    // ── Return ──────────────────────────────────────────────────────────────────

    return {
        popupState: state,

        isOpen: state.open,
        currentData: state.data,
        isCreating: state.mode === 'create',
        isEditing: state.mode === 'edit',
        isViewing: state.mode === 'view',
        isDeleting: state.mode === 'delete',

        openCreate,
        openEdit,
        openView,
        openDelete,
        openWith,
        close,
    };
}
