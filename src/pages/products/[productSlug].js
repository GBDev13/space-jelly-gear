import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import Head from "next/head";

import Layout from "@components/Layout";
import Header from "@components/Header";
import Container from "@components/Container";
import Button from "@components/Button";

import styles from "@styles/Product.module.scss";
import Image from "next/image";

export default function Product({ product }) {
  return (
    <Layout>
      <Head>
        <title>{product.name}</title>
        <meta name="description" content={product.description.text} />
      </Head>

      <Container>
        <div className={styles.productWrapper}>
          <div className={styles.productImage}>
            <Image
              width={product.image.width}
              height={product.image.height}
              src={product.image.url}
              alt={product.name}
            />
          </div>
          <div className={styles.productContent}>
            <h1>{product.name}</h1>
            <div
              className={styles.productDescription}
              dangerouslySetInnerHTML={{
                __html: product.description?.html,
              }}
            />
            <p className={styles.productPrice}>${product.price}</p>
            <p className={styles.productBuy}>
              <Button>Add to Cart</Button>
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const client = new ApolloClient({
    uri: "https://api-sa-east-1.graphcms.com/v2/cl4m0woe776xq01xvfzgw4s3k/master",
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query PageProduct($slug: String) {
        product(where: { slug: $slug }) {
          slug
          name
          price
          image
          description {
            html
            text
          }
        }
      }
    `,
    variables: {
      slug: params.productSlug,
    },
  });

  const product = data.data.product;

  return {
    props: {
      product,
    },
  };
}

export async function getStaticPaths() {
  const client = new ApolloClient({
    uri: "https://api-sa-east-1.graphcms.com/v2/cl4m0woe776xq01xvfzgw4s3k/master",
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query PageProducts {
        products {
          slug
        }
      }
    `,
  });

  const paths = data.data.products.map((product) => ({
    params: {
      productSlug: product.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}
