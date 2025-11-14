import styled from 'styled-components';
import { useUploadStore } from '../store/upload.store';

const ProgressContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.primary}
  );
  width: ${({ $percentage }) => $percentage}%;
  transition: width 0.3s ease;
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const ProgressText = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

export function UploadProgress() {
  const { progress } = useUploadStore();

  if (!progress) {
    return null;
  }

  return (
    <ProgressContainer>
      <ProgressBar>
        <ProgressFill $percentage={progress.percentage} />
      </ProgressBar>
      <ProgressText>Загрузка: {progress.percentage}%</ProgressText>
    </ProgressContainer>
  );
}
