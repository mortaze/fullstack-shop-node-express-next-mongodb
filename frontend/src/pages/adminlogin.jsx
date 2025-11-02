import React from "react";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import AdminLoginArea from "@/components/admin-login/admin-login-area";

const AdminLoginPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Admin Login" />
      <CommonBreadcrumb title="Admin Login" subtitle="Admin Login" center={true} />
      <AdminLoginArea />
    </Wrapper>
  );
};

export default AdminLoginPage;
