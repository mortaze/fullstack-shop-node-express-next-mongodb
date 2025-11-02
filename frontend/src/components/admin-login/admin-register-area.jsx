import React from "react";
import Link from "next/link";
import AdminRegisterForm from "../forms/admin-register-form";
import AdminLoginShapes from "./admin-login-shapes";

const AdminRegisterArea = () => {
  return (
    <section className="tp-login-area pb-140 p-relative z-index-1 fix">
      <AdminLoginShapes />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8">
            <div className="tp-login-wrapper">
              <div className="tp-login-top text-center mb-30">
                <h3 className="tp-login-title">Register Admin</h3>
                <p>
                  Already have an account?{" "}
                  <span>
                    <Link href="/admin/login">Sign In</Link>
                  </span>
                </p>
              </div>
              <div className="tp-login-option">
                <div className="tp-login-mail text-center mb-40">
                  <p>Sign up with <a href="#">Email</a></p>
                </div>
                <AdminRegisterForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminRegisterArea;
