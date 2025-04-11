import React, { Fragment } from "react";
import Navbar from "../../components/frontend/navbar/Navbar";
import Footer from "../../components/frontend/footer/Footer";
import Index from "../../components/frontend/main/Index";

export default function Home() {
  return (
    <Fragment>
      {/* <Navbar /> */}
      <Index />
      <Footer />
    </Fragment>
  );
}
