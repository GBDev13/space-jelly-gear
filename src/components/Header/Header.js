import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";

import Container from "@components/Container";

import styles from "./Header.module.scss";
import { useSnipcart } from "use-snipcart/useSnipcart";

const Header = () => {
  const { cart = {} } = useSnipcart();

  const subtotal = cart.subtotal ?? 0;

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
            <Link href="#">
              <a>Link</a>
            </Link>
          </li>
          <li>
            <Link href="#">
              <a>Link</a>
            </Link>
          </li>
          <li>
            <Link href="#">
              <a>Link</a>
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
          <li>
            <Link href="#">
              <a>ES</a>
            </Link>
          </li>
        </ul>
      </Container>
    </header>
  );
};

export default Header;
