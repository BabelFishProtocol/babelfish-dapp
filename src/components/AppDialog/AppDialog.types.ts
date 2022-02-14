import React from "react";

export type AppDialogProps = {
    isOpenDialog: boolean,
    onClose: () => void,
    icon?: string,
    title?: string,
    description?: string,
    children?: React.ReactNode
};
