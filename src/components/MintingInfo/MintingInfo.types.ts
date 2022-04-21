import React from 'react';

export type MintingProcessInfo = {
  label: string;
  value: React.ReactNode;
  isProminant?: boolean;
  formatTx?: boolean;
};

export type MintingInfoPros = {
  data: MintingProcessInfo[];
};
