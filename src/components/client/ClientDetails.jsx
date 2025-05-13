import { useEffect, useState } from "react";
import { useClientStore } from "../../store/clientStore";
import {
  ArrowLeftIcon,
  UserIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

const ClientDetails = ({ clientId, goBack }) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSingleClient = useClientStore((state) => state.fetchSingleClient);

  useEffect(() => {
    const getClientDetails = async () => {
      setLoading(true);
      const data = await fetchSingleClient(clientId);
      setClient(data);
      setLoading(false);
    };

    if (clientId) {
      getClientDetails();
    }
  }, [clientId, fetchSingleClient]);

  if (loading) {
    return (
      <div className="p-6 text-center text-indigo-600 font-medium">
        Loading client details...
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6 text-center text-red-600 font-medium">
        Client not found.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      {/* Client Details Card */}
      <div className="bg-white p-8 rounded-3xl shadow-md space-y-12">
        {/* Header */}
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-3xl uppercase">
            {client?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 capitalize">
              {client.name}
            </h2>
            <p className="text-gray-400 text-sm mt-1">Client Details</p>
          </div>
        </div>

        {/* Grouped Info Sections */}
        <div className="space-y-12">
          {/* Contact Information */}
          <Section title="Contact Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem
                icon={<UserIcon className="w-5 h-5 text-indigo-400" />}
                label="Representative"
                value={client.contactPerson}
              />
              <DetailItem
                icon={<EnvelopeIcon className="w-5 h-5 text-indigo-400" />}
                label="Email"
                value={client.email}
              />
              <DetailItem
                icon={<PhoneIcon className="w-5 h-5 text-indigo-400" />}
                label="Phone"
                value={client.phone}
              />
            </div>
          </Section>

          {/* Address Information */}
          <Section title="Address Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem
                icon={
                  <BuildingOfficeIcon className="w-5 h-5 text-indigo-400" />
                }
                label="Billing Address"
                value={client.billingAddress}
              />
              <DetailItem
                icon={<MapPinIcon className="w-5 h-5 text-indigo-400" />}
                label="Address"
                value={client.address}
              />
            </div>
          </Section>

          {/* Business Information */}
          <Section title="Business Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem
                icon={
                  <CurrencyDollarIcon className="w-5 h-5 text-indigo-400" />
                }
                label="Currency"
                value={client.currency}
              />
              <DetailItem
                icon={<BriefcaseIcon className="w-5 h-5 text-indigo-400" />}
                label="Industry"
                value={client.industry}
              />
              <DetailItem
                icon={<CalendarDaysIcon className="w-5 h-5 text-indigo-400" />}
                label="Connected On"
                value={new Date(client.createdAt).toLocaleDateString()}
              />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

// Section wrapper component
const Section = ({ title, children }) => (
  <div className="space-y-1">
    <h3 className="text-gray-700 font-semibold text-lg">{title}</h3>
    <div className="bg-indigo-50 p-6 rounded-2xl">{children}</div>
  </div>
);

// Detail item component
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-gray-800 font-medium ${!value && "text-gray-400"}`}>
        {value || "N/A"}
      </p>
    </div>
  </div>
);

export default ClientDetails;
