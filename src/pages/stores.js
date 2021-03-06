import { useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import Head from "next/head";
import { FaExternalLinkAlt } from "react-icons/fa";

import center from "@turf/center";
import { points } from "@turf/helpers";

import Layout from "@components/Layout";
import Container from "@components/Container";
import Map, { MapEffect } from "@components/Map";

import styles from "@styles/Page.module.scss";

export default function Stores({ storeLocations }) {
  const [activeStore, setActiveStore] = useState();

  const features = points(
    storeLocations.map(({ location }) => {
      return [location.latitude, location.longitude];
    })
  );

  const [defaultLatitude, defaultLongitude] =
    center(features)?.geometry.coordinates;

  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <Container>
        <h1>Locations</h1>

        <div className={styles.stores}>
          <div className={styles.storesLocations}>
            <ul className={styles.locations}>
              {storeLocations.map((location) => (
                <li key={location.id}>
                  <p className={styles.locationName}>{location.name}</p>
                  <address>{location.address}</address>
                  <p>{location.phoneNumber}</p>
                  <p className={styles.locationDiscovery}>
                    <button onClick={() => setActiveStore(location.id)}>
                      View on Map
                    </button>
                    <a
                      href={`https://www.google.com.br/maps/dir//${location.location.latitude},${location.location.longitude}/@${location.location.latitude},${location.location.longitude},12z`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Get Directions
                      <FaExternalLinkAlt />
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.storesMap}>
            <div className={styles.storesMapContainer}>
              <Map
                className={styles.map}
                center={[defaultLatitude, defaultLongitude]}
                zoom={4}
              >
                {({ TileLayer, Marker, Popup }, map) => {
                  return (
                    <>
                      <MapEffect
                        activeStore={activeStore}
                        storeLocations={storeLocations}
                      />
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {storeLocations.map((location) => {
                        const { latitude, longitude } = location.location;
                        return (
                          <Marker
                            key={location.id}
                            position={[latitude, longitude]}
                          >
                            <Popup>
                              <p>{location.name}</p>
                              <p>{location.address}</p>
                            </Popup>
                          </Marker>
                        );
                      })}
                    </>
                  );
                }}
              </Map>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://api-sa-east-1.graphcms.com/v2/cl4m0woe776xq01xvfzgw4s3k/master",
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query PageStores {
        storeLocations {
          address
          id
          name
          phoneNumber
          location {
            longitude
            latitude
          }
        }
      }
    `,
  });

  const storeLocations = data.data.storeLocations;

  return {
    props: {
      storeLocations,
    },
  };
}
