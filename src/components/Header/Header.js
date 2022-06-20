import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";

import Container from "@components/Container";

import styles from "./Header.module.scss";
import { useSnipcart } from "use-snipcart/useSnipcart";
import { useRouter } from "next/router";

const Header = () => {
  const { cart = {} } = useSnipcart();

  const subtotal = cart.subtotal ?? 0;

  const { locale: activeLocale, locales, asPath } = useRouter();

  const availableLocales = locales.filter((locale) => locale !== activeLocale);

  return (
    <header className={styles.header}>
      <Container className={styles.headerContainer}>
        <p className={styles.headerTitle}>
          <Link href="/">
            <a>Space Jelly</a>
          </Link>
        </p>
        <ul className={styles.headerLinks}>
          <li>
            <Link href="/categories/apparel">
              <a>Apparel</a>
            </Link>
          </li>
          <li>
            <Link href="/categories/accessories">
              <a>Accessories</a>
            </Link>
          </li>
          <li>
            <Link href="/stores">
              <a>Find a Store</a>
            </Link>
          </li>
        </ul>
        <p className={styles.headerCart}>
          <button className="snipcart-checkout">
            <FaShoppingCart />
            <span>${subtotal?.toFixed(2)}</span>
          </button>
        </p>
        <ul className={styles.headerLocales}>
          {availableLocales.map((locale) => (
            <li key={locale}>
              <Link href={asPath} locale={locale}>
                <a>{locale.toUpperCase()}</a>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </header>
  );
};

export default Header;
