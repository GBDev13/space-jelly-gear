import Head from "next/head";
import Link from "next/link";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import Layout from "@components/Layout";
import Container from "@components/Container";
import Button from "@components/Button";

import styles from "@styles/Page.module.scss";
import Image from "next/image";
import { buildImage } from "@lib/cloudinary";

export default function Home({ home, products }) {
  const { heroTitle, heroText, heroLink, heroBackground } = home;

  return (
    <Layout>
      <Head>
        <title>Space Jelly Gear</title>
        <meta name="description" content="Get your Space Jelly gear!" />
      </Head>

      <Container>
        <h1 className="sr-only">Space Jelly Gear</h1>

        <div className={styles.hero}>
          <Link href={heroLink}>
            <a>
              <div className={styles.heroContent}>
                <h2>{heroTitle}</h2>
                <p>{heroText}</p>
              </div>
              <Image
                className={styles.heroImage}
                src={buildImage(heroBackground.public_id).toURL()}
                width={heroBackground.width}
                height={heroBackground.height}
                alt=""
              />
            </a>
          </Link>
        </div>

        <h2 className={styles.heading}>Featured Gear</h2>

        <ul className={styles.products}>
          {products.map((product) => {
            const imageUrl = buildImage(product.image.public_id)
              .resize("w_900,h_900")
              .toURL();
            return (
              <li key={product.slug}>
                <Link href={`/products/${product.slug}`}>
                  <a>
                    <div className={styles.productImage}>
                      <Image
                        width="900"
                        height="900"
                        src={imageUrl}
                        alt={product.name}
                      />
                    </div>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                    <p className={styles.productPrice}>${product.price}</p>
                  </a>
                </Link>
                <p>
                  <Button
                    className="snipcart-add-item"
                    data-item-id={product.id}
                    data-item-price={product.price}
                    data-item-url={`/products/${product.slug}`}
                    data-item-description={product.description?.text}
                    data-item-image={imageUrl}
                    data-item-name={product.name}
                  >
                    Add to Cart
                  </Button>
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  console.log(locale);
  const client = new ApolloClient({
    uri: "https://api-sa-east-1.graphcms.com/v2/cl4m0woe776xq01xvfzgw4s3k/master",
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query PageHome($locale: Locale!) {
        page(where: { slug: "home" }) {
          id
          name
          heroTitle
          heroText
          heroLink
          heroBackground
          slug
          localizations(locales: [$locale]) {
            heroText
            heroTitle
            locale
          }
        }
        products(where: { categories_some: { slug: "featured" } }) {
          id
          slug
          name
          price
          image
        }
      }
    `,
    variables: {
      locale,
    },
  });

  let home = data.data.page;

  if (home.localizations.length > 0) {
    home = {
      ...home,
      ...home.localizations[0],
    };
  }

  const products = data.data.products;

  return {
    props: {
      home,
      products,
    },
  };
}
