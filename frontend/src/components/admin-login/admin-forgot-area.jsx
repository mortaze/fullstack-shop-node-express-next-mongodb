import React from "react";
import Link from "next/link";
import AdminForgotForm from "../forms/admin-forgot-form";
import AdminLoginShapes from "./admin-login-shapes";

const AdminForgotArea = () => {
  return (
    <section className="tp-login-area pb-140 p-relative z-index-1 fix">
      <AdminLoginShapes />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8">
            <div className="tp-login-wrapper">
              <div className="tp-login-top text-center mb-30">
                <h3 className="tp-login-title">Reset Admin Password</h3>
                <p>Enter your admin email to receive a password reset link.</p>
              </div>
              <div className="tp-login-option">
                <AdminForgotForm />
                <div className="tp-login-suggetions d-sm-flex align-items-center justify-content-center">
                  <div className="tp-login-forgot">
                    <span>
                      Remember Password? <Link href="/admin/login">Login</Link>
                    </span>
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

export default AdminForgotArea;
