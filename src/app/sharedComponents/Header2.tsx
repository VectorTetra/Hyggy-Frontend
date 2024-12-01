import Link from 'next/link';
import React from 'react';

const Header2 = () => {
  return (
    <header>
      <div>
        <h1>Шапка 2</h1>
        <nav>
          <Link prefetch={true} href="/">Головна</Link>
          <Link prefetch={true} href="/contact">Контакти</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header2;
