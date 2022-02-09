import React from "react";

export type AppDialogProps = {
    openDialog: boolean,
    onClose: () => void,
    icon?: any,
    title?: string,
    description?: string,
    children?: React.ReactNode
};
