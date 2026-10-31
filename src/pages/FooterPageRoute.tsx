
import { Navigate } from "react-router-dom";
import FooterContentPage from "@/components/common/FooterContentPage";
import { footerPages } from "@/data/footer-pages";

type FooterPageRouteProps = {
  slug: string;
};

export default function FooterPageRoute({
  slug,
}: FooterPageRouteProps) {
  const page = footerPages.find((item) => item.slug === slug);

  if (!page) {
    return <Navigate to="/home" replace />;
  }

  return <FooterContentPage page={page} />;
}
