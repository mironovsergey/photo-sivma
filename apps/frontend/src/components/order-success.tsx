import styled from 'styled-components';
import { useUploadStore } from '../store/upload.store';

const Container = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const OrderNumber = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: 0.05em;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ExpiryText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.light};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const Button = styled.button`
  width: 100%;
  max-width: 300px;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }
`;

export function OrderSuccess() {
  const { orderNumber, reset } = useUploadStore();

  if (!orderNumber) {
    return null;
  }

  return (
    <Container>
      <Title>Номер загрузки</Title>

      <OrderNumber>{orderNumber}</OrderNumber>

      <Subtitle>Покажите этот номер менеджеру</Subtitle>
      <ExpiryText>Срок хранения — 3 дня</ExpiryText>

      <Button onClick={reset}>Создать новый пакет</Button>
    </Container>
  );
}
