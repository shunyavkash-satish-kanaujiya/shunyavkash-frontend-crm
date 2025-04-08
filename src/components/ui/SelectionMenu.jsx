import { useState, useEffect } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useRoleStore } from "../../store/roleStore.js";

// Add "Select Role" as default
const roles = ["Select Role", "Admin", "HR", "Employee"];

const SelectionMenu = () => {
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const setRole = useRoleStore((state) => state.setRole);
  console.log("role:", selectedRole);

  useEffect(() => {
    setRole(selectedRole);
  }, [selectedRole, setRole]);

  return (
    <Listbox value={selectedRole} onChange={setSelectedRole}>
      <Label className="select-label mb-0 block text-sm font-medium text-gray-900">
        Login as
      </Label>
      <div className="relative mt-2">
        <ListboxButton className="cursor-pointer grid w-full grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline outline-gray-300 focus:outline-2 focus:outline-indigo-600 text-sm">
          <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
            <span className="block truncate">{selectedRole}</span>
          </span>
          <ChevronUpDownIcon className="col-start-1 row-start-1 size-5 justify-self-end text-gray-500" />
        </ListboxButton>

        <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
          {roles.map((role) => (
            <ListboxOption
              key={role}
              value={role}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                  active ? "bg-indigo-600 text-white" : "text-gray-900"
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? "font-semibold" : "font-normal"
                    }`}
                  >
                    {role}
                  </span>
                  {selected && role !== "Select Role" && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                      <CheckIcon className="h-5 w-5" />
                    </span>
                  )}
                </>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};

export default SelectionMenu;
