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
  console.log('Abort signal', AbortSignal.timeout(200));
  return (
    <html lang="en">
      <body>
        <FqlxClientProvider>{children}</FqlxClientProvider>
      </body>
    </html>
  );
}
