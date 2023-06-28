import FqlxClientProvider from './FqlxClientProvider';
import './globals.css';

export const metadata = {
  title: 'Fqlx Client',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FqlxClientProvider>{children}</FqlxClientProvider>
      </body>
    </html>
  );
}
