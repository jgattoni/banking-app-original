import AnimatedCounter from "./AnimatedCounter";
import DoughnutChart from "./DoughnutChart";

const TotalBalanceBox = ({
  accounts, totalAccounts, totalCurrentBalance
}: TotalBalanceBoxProps) => {
  return(
      <section className={"flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 shadow-chart sm:gap-6 sm:p-6"}>
        <div className={"flex size-full max-w-[100px] items-center sm:max-w-[120px]"}>
          <DoughnutChart />
        </div>

        <div className={"flex flex-col gap-6"}>
          <h2 className={"text-xl font-bold text-gray-900"}>
            Bank Accounts: {totalAccounts}
          </h2>
          <div className={"flex flex-col gap-2"}>
            <p className={"text-sm font-medium text-gray-600"}>
              Total Current Balance:
            </p>
            <div className={"text-2xl lg:text-3xl flex-1 font-semibold text-gray-900 flex-center gap-2"}>
                <AnimatedCounter amount={totalCurrentBalance}/>
            </div>
          </div>
        </div>
      </section>
  )
}

export default TotalBalanceBox