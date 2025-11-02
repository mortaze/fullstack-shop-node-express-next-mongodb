import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from 'next/router';
import Link from 'next/link';
// internal
import { CloseEye, OpenEye } from '@/svg';
import ErrorMsg from '../common/error-msg';
import { useLoginAdminMutation } from '@/redux/features/auth/adminApi'; // 🔹 endpoint مخصوص ادمین
import { notifyError, notifySuccess } from '@/utils/toast';

// ✅ اعتبارسنجی
const schema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

const AdminLoginForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [loginAdmin, { }] = useLoginAdminMutation(); // ✅ برای لاگین ادمین
  const router = useRouter();

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ✅ ارسال فرم
  const onSubmit = (data) => {
    loginAdmin({
      email: data.email,
      password: data.password,
    })
      .then((res) => {
        if (res?.data) {
          notifySuccess("Admin login successful!");
          router.push("/admin/dashboard"); // 🔹 مسیر داشبورد ادمین
        } else {
          notifyError(res?.error?.data?.error || "Login failed");
        }
      });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="tp-login-input-wrapper">
        {/* ایمیل */}
        <div className="tp-login-input-box">
          <div className="tp-login-input">
            <input
              {...register("email", { required: `Email is required!` })}
              name="email"
              id="email"
              type="email"
              placeholder="admin@mail.com"
            />
          </div>
          <div className="tp-login-input-title">
            <label htmlFor="email">Admin Email</label>
          </div>
          <ErrorMsg msg={errors.email?.message} />
        </div>

        {/* پسورد */}
        <div className="tp-login-input-box">
          <div className="p-relative">
            <div className="tp-login-input">
              <input
                {...register("password", { required: `Password is required!` })}
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="Min. 6 character"
              />
            </div>
            <div className="tp-login-input-eye" id="password-show-toggle">
              <span className="open-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <CloseEye /> : <OpenEye />}
              </span>
            </div>
            <div className="tp-login-input-title">
              <label htmlFor="password">Password</label>
            </div>
          </div>
          <ErrorMsg msg={errors.password?.message} />
        </div>
      </div>

      {/* گزینه‌ها */}
      <div className="tp-login-suggetions d-sm-flex align-items-center justify-content-between mb-20">
        <div className="tp-login-remeber">
          <input id="remeber" type="checkbox" />
          <label htmlFor="remeber">Remember me</label>
        </div>
        <div className="tp-login-forgot">
          <Link href="/admin/forgot">Forgot Password?</Link>
        </div>
      </div>

      {/* دکمه ورود */}
      <div className="tp-login-bottom">
        <button type='submit' className="tp-login-btn w-100">Login as Admin</button>
      </div>
    </form>
  );
};

export default AdminLoginForm;
