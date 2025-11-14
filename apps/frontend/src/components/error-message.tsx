import styled from 'styled-components';
import { useUploadStore } from '../store/upload.store';

const ErrorContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.error}15;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  margin: 0;
`;

export function ErrorMessage() {
  const { error } = useUploadStore();

  if (!error) {
    return null;
  }

  return (
    <ErrorContainer>
      <ErrorText>{error}</ErrorText>
    </ErrorContainer>
  );
}
