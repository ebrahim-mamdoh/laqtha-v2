import React from 'react'
import styles from "./deleteAcc.module.css";
export default function page() {
  return (<> 
   <h2 className={`${styles.title}`}>الملف الشخصي</h2>
  <div className={`${styles.lastSettingsItem}`}>
          <div>
        <div className={`${styles.label}`}> تنبيه</div>
          <p className={`${styles.description}`}>ان قمت بحذف حسابك فلن تتمكن من استرجاعه او استرجاع اي بيانات تخصه بشكل نهائي </p>
          </div>
        
      </div>

<form >
              <div className="row mb-3">
                <div className=" mb-3">
                  <label className="form-label">كلمة المرور</label>
                  <input
                    type="text"
                    className={`${styles.formInput} form-control`}
                    placeholder='********'

                   
                  />
                </div>
              
              </div>
               <div className="row mb-3">
                <div className=" mb-3">
                  <label className="form-label">تاكيد كلمة المرور</label>
                  <input
                    type="text"
                    className={`${styles.formInput} form-control`}
                    placeholder='********'
                    
                  />
                </div>
              
              </div>
              </form>
                    
  
  
  </>
  )
}
