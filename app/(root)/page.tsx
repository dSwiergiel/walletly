import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotlaBalanceBox from "@/components/TotlaBalanceBox";
import React from "react";

const Home = () => {
  const loggedIn = {
    firstName: "Deven",
    lastName: "Swiergiel",
    email: "devenswiergiel@gmail.com",
  };
  return (
    <section className="home">
      <div className="home-content">
        <header className="">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />
          <TotlaBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={7839.32}
          />
        </header>
        RECENT TRANSACTIONS
      </div>
      <RightSidebar
        user={loggedIn}
        transactions={[]}
        banks={[{ currentBalance: 145.32 }, { currentBalance: 223.33 }]}
      />
    </section>
  );
};

export default Home;
