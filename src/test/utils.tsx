import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { SessionProvider } from 'next-auth/react';

const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER',
  },
  expires: '2099-01-01T00:00:00.000Z',
};

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider session={mockSession as any}>
      {children}
    </SessionProvider>
  );
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from '@testing-library/react';
export { customRender as render };
