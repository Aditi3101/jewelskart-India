import React from "react";
import { useParams } from "react-router-dom";
import TopNavBar from "./TopNavBar";
import Footer from "./Footer";
import CategoryCards from "./CategoryCards";
import ResponsiveNavBarWrapper from "./esponsiveNavBarWrapper";

interface TypePageProps {
  typeId?: number;
}

const TypePage: React.FC<TypePageProps> = ({ typeId: propTypeId }) => {
  const { typeId: paramTypeId } = useParams<{ typeId: string }>();
  const typeId = propTypeId || parseInt(paramTypeId || "0");

  return (
    <>
      <TopNavBar />
      <ResponsiveNavBarWrapper />
      <CategoryCards typeId={typeId} />
      <Footer />
    </>
  );
};

export default TypePage;