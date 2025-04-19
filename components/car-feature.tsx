import { useUserStore } from "@/lib/store";
import CarIcon from "@/public/car-icon.svg";
import Delivery from "@/public/delivery.svg";
import CoinStack from "@/public/coin-stack.svg";

const CarFeature = () => {
    const { name } = useUserStore();

  return (
    <div>
    {!name &&
        <section className="bg-white bg-opacity-30 mb-1 dark:bg-opacity-10 mt-1 backdrop-blur-lg sm:py-12 py-6 bg-muted">
            <div className="container mx-auto px-4">
                <h2 
                style={{ fontFamily: "var(--font-equinox), sans-serif" }}
                className="text-3xl font-bold text-center mb-12">
                Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center bg-card p-6 rounded-lg shadow-md">
                        <CarIcon className="w-28 h-12 stroke-primary fill-primary mb-4 mb-4 stroke-[6px]" />
                        <h3 
                        style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }}
                        className="text-xl font-semibold mb-2">Easy Booking</h3>
                        <p 
                        className="text-muted-foreground">
                        Book your desired car with just a few clicks.
                        </p>
                    </div>
                    <div className="flex flex-col items-center bg-card p-6 rounded-lg shadow-md">
                        <Delivery className="w-28 h-12 stroke-primary fill-primary mb-4 mb-4 stroke-[6px]" />
                        <h3 
                        style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }}
                        className="text-xl font-semibold mb-2">Home delivery</h3>
                        <p className="text-muted-foreground">
                        Get you car delivered to your home.
                        </p>
                    </div>
                    <div className="flex flex-col items-center bg-card p-6 rounded-lg shadow-md">
                        <CoinStack className="w-28 h-12 fill-primary mb-4 mb-4" />
                        <h3 
                        style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }}
                        className="text-xl font-semibold mb-2">Reduced Costs</h3>
                        <p className="text-muted-foreground">
                        No middleman to increase cost, the cars are owned by us.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    }
    </div>
  );
};

export default CarFeature;
