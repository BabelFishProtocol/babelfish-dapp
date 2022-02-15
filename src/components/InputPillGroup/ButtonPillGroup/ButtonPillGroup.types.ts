import { BigNumber } from "ethers";
import React from "react";

export type ButtonPillGroupProps = {
  availableValues: number[];
  disabled?: boolean;
  value?: string;
  handleChange?: (e: React.MouseEvent<HTMLElement>, newPercentValue: string) 
};

export type ButtonPillProps = {
  value: number;
};
