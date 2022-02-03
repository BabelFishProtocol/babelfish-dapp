import React from 'react';
import {
  PageHeader,
  PageAligner,
  PageContainer,
  PageContentContainer,
} from './PageView.styles';
import { PageViewProps } from './PageView.types';

export const PageView = ({ title, children }: PageViewProps) => {
  return (
    <PageAligner>
      <PageContainer>
        <PageHeader>{title}</PageHeader>
        <PageContentContainer>{children}</PageContentContainer>
      </PageContainer>
    </PageAligner>
  );
};
