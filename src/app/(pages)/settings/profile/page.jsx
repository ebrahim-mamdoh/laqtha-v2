"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./profile.module.css";

export default function Profile() {
  const [userData, setUserData] = useState({
    firstName: "",
    email: "",
    phone: "",
    image: "/default-avatar.png",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // مثال: تحميل بيانات المستخدم عند الدخول
    const fetchUser = async () => {
      setUserData({
        firstName: "محمد",
        email: "Hello@Mohamed_dham.com",
        phone: "966501234567",
        image: "/default-avatar.png",
      });
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("تم حفظ البيانات:", userData);
      alert("✅ تم حفظ التغييرات بنجاح");
    } catch (error) {
      console.error(error);
      alert("❌ حدث خطأ أثناء حفظ التغييرات");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  return (
  <>
   <div className={`${styles.card} shadow-sm`}>
              <h2 className={`${styles.title}`}>الملف الشخصي</h2>

            <div className={`${styles.profilePic} text-center mb-4`}>
              <div className={styles.avatarWrapper}>
                <Image
                  src="/images/avatar.svg"
                  alt="User Avatar"
                  width={100}
                  height={100}
                  className={`rounded-circle  ${styles.avatar}`}
                />
                <label htmlFor="uploadImage" className={styles.uploadIcon}>
                  <i className="camera-icon">
                      <Image
                  src="/icons/Camera.svg"
                  alt="User Avatar"
                  width={20}
                  height={20}
                  className={`rounded-circle  ${styles.Upload}`}
                /> 
                  </i>
                </label>
                <input
                  id="uploadImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </div>

              <p className={styles.username}>
                {userData.firstName} 
              </p>

              <div className={styles.btns}>
                <button className={styles.updatepic}>تحديث الصورة</button>
                <button className={styles.deletepic}>حذف الصورة</button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-12 mb-3">
                  <label className="form-label">الاسم</label>
                  <input
                    type="text"
                    className={`${styles.formInput} form-control`}
                    value={userData.firstName}
                    onChange={(e) =>
                      setUserData({ ...userData, firstName: e.target.value })
                    }
                  />
                </div>
              
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label">البريد الإلكتروني</label>
                  <input
                    type="email"
                   className={`${styles.formInput} form-control`}
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">رقم الجوال</label>
                  <input
                    type="text"
                    className={`${styles.formInput} form-control`}
                    value={userData.phone}
                    onChange={(e) =>
                      setUserData({ ...userData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

                <div className={styles.btns}>
                <button className={styles.updatepic}> حفظ</button>
                <button className={styles.deletepic}>الغاء </button>
              </div>
            </form>
          </div>
  </>
  );
}
