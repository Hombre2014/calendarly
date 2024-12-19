import Link from 'next/link';
import Image from 'next/image';

import AuthModal from './AuthModal';
import Logo from '@/public/logo.png';

const Navbar = () => {
  return (
    <div className="flex py-5 items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} alt="Logo" className="size-10" />
        <h1 className="text-3xl font-semibold">
          <span className="text-primary">Calendarly</span>
        </h1>
      </Link>
      <AuthModal />
    </div>
  );
};

export default Navbar;
