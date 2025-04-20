import React, { useEffect, useState } from "react";
import { ConnectWallet } from "@nfid/identitykit/react";
import { useAuth } from "./StateManagement/useContext/useClient";
import './index.scss';
const ConnectBtn = ({ onClick }) => (

  <button
    onClick={onClick}
    className=" bg-white"
  >
    <div className=" w-full h-full  rounded-xl flex items-center justify-center  ">
      Connect Wallet
    </div>
  </button>
);
const App = () => {
  const { isAuthenticated,  principal } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      userCheck();
      userDatacheck()
    }
  }, [isAuthenticated]);


  return (

      <nav
        className="flex  justify-between px-20 py-10 items-center h-10 bg-slate-400"
      >

        <div className="flex items-center">
          <h1>Logo</h1>
        </div>

        {!isAuthenticated && (
          <div className="hidden font-posterama md:block">
            <ConnectWallet
              connectButtonComponent={ConnectBtn}
              className="rounded-full bg-black"
            />
          </div>
        )}

        {/* User Info */}
        {isAuthenticated && (
          <div className=" hidden md:inline-block relative  rounded-2xl bg-gradient-to-r  from-[#f09787] to-[#CACCF5] text-left p-[1.5px]">
            <button
              onClick={toggleDropdown}
              className="flex items-center text-white rounded-full"
            >
              <div className="bg-black h-full w-full rounded-2xl flex items-center p-1 px-3">

                <div className="flex flex-col items-start w-24 h-8 lg:w-40 lg:h-full ">
                  <span className=" text-[10px] lg:text-xs text-gray-400 w-full overflow-hidden whitespace-nowrap text-ellipsis">
                    {principal?.toString() || "N/A"}
                  </span>
                </div>

              </div>
            </button>


          </div>
        )}
      </nav>

  );
};
export default App;


