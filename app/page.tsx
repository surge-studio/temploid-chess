import { Game } from '@/components/Game';
import { FC } from 'react';

const Page: FC = () => {
  return (
    <main className="flex items-center justify-center h-full">
      <Game />
    </main>
  );
};

export default Page;
