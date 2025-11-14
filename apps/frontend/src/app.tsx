import { useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import apiService from './services/api.service';
import { useTelegram } from './hooks/use-telegram';
import { useUploadStore } from './store/upload.store';
import { FileUpload } from './components/file-upload';
import { FilePreview } from './components/file-preview';
import { UploadProgress } from './components/upload-progress';
import { OrderSuccess } from './components/order-success';
import { ErrorMessage } from './components/error-message';
import { theme } from './styles/theme';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #F5F1E8;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
  }

  input {
    font-family: inherit;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Content = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSize.md};
`;

function App() {
  const { isReady, initDataRaw } = useTelegram();
  const { files, status, orderNumber, setStatus, setProgress, setOrderNumber, setError } =
    useUploadStore();

  useEffect(() => {
    if (initDataRaw) {
      apiService.setInitData(initDataRaw);
    }
  }, [initDataRaw]);

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Выберите хотя бы один файл');
      return;
    }

    try {
      setStatus('uploading');
      setError(null);

      const response = await apiService.uploadPhotos(files, (progress) => {
        setProgress(progress);
      });

      setStatus('success');
      setOrderNumber(response.data.orderNumber);
      setProgress(null);
    } catch (error) {
      setStatus('error');
      setProgress(null);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Произошла ошибка при загрузке');
      }
    }
  };

  if (!isReady) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <LoadingContainer>
          <Spinner />
          <LoadingText>Загрузка...</LoadingText>
        </LoadingContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <Content>
          {status === 'success' && orderNumber ? (
            <OrderSuccess />
          ) : (
            <>
              <Header>
                <Title>Передать файлы в печать</Title>
                <Subtitle>
                  Загрузите файлы со смартфона.
                  <br />
                  Номер будет доступен сразу.
                </Subtitle>
              </Header>

              <Card>
                <ErrorMessage />
                <FileUpload />
                <FilePreview />
                <UploadProgress />

                {files.length > 0 && (
                  <button
                    onClick={handleUpload}
                    disabled={status === 'uploading'}
                    style={{
                      width: '100%',
                      padding: '16px',
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.white,
                      fontSize: theme.fontSize.md,
                      fontWeight: theme.fontWeight.semibold,
                      borderRadius: theme.borderRadius.md,
                      marginTop: theme.spacing.lg,
                      transition: 'background-color 0.2s',
                      opacity: status === 'uploading' ? 0.6 : 1,
                    }}
                    onMouseEnter={(event) => {
                      if (status !== 'uploading') {
                        event.currentTarget.style.backgroundColor = theme.colors.primaryDark;
                      }
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.backgroundColor = theme.colors.primary;
                    }}
                  >
                    {status === 'uploading' ? 'Загрузка...' : `Загрузить (${files.length})`}
                  </button>
                )}
              </Card>
            </>
          )}
        </Content>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
