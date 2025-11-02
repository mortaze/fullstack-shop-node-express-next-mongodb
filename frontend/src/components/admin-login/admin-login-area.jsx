import React from "react";
import Link from "next/link";

import AdminLoginForm from "../forms/AdminLoginForm";
import AdminLoginShapes from "./admin-login-shapes";

const AdminLoginArea = () => {
  return (
    <section className="tp-login-area pb-140 p-relative z-index-1 fix">
      <AdminLoginShapes />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8">
            <div className="tp-login-wrapper">
              <div className="tp-login-top text-center mb-30">
                <h3 className="tp-login-title">Admin Login</h3>
                <p>
                  Only authorized administrators can access this panel.
                </p>
              </div>
              <div className="tp-login-option">
                <div className="tp-login-mail text-center mb-40">
                  <p>Sign in with <a href="#">Email</a></p>
                </div>
                <AdminLoginForm />
                <div className="tp-login-suggetions d-sm-flex align-items-center justify-content-between">
                  <div className="tp-login-forgot">
                    <Link href="/admin/forgot">Forgot Password?</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLoginArea;
