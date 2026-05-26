import { createContext, useContext, useState, useEffect } from 'react';

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  // state
  const [breeds, setBreeds] = useState([]);
  const [genders, setGenders] = useState([]);
  const [intakeTypes, setIntakeTypes] = useState([]);
  const [approvalTypes, setApprovalTypes] = useState([]);
  const [behaviorTags, setBehaviorTags] = useState([]);
  const [locationTypes, setLocationTypes] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [states, setStates] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // effect to load all reference data at once
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [
          breedRes,
          genderRes,
          intakeRes,
          approvalRes,
          behaviorRes,
          locationRes,
          roleRes,
          sizeRes,
          stateRes,
          statusRes,
        ] = await Promise.all([
          fetch('http://localhost:5000/breeds'),
          fetch('http://localhost:5000/genders'),
          fetch('http://localhost:5000/intake-types'),
          fetch('http://localhost:5000/approval-types'),
          fetch('http://localhost:5000/behavior-tags'),
          fetch('http://localhost:5000/location-types'),
          fetch('http://localhost:5000/role-types'),
          fetch('http://localhost:5000/sizes'),
          fetch('http://localhost:5000/states'),
          fetch('http://localhost:5000/statuses'),
        ]);

        const breedData = await breedRes.json();
        const genderData = await genderRes.json();
        const intakeData = await intakeRes.json();
        const approvalData = await approvalRes.json();
        const behaviorData = await behaviorRes.json();
        const locationData = await locationRes.json();
        const roleData = await roleRes.json();
        const sizeData = await sizeRes.json();
        const stateData = await stateRes.json();
        const statusData = await statusRes.json();

        setBreeds(
          breedData.map((b) => ({
            value: b.breed_id,
            label: b.breed_name,
          })),
        );

        setGenders(
          genderData.map((g) => ({
            value: g.gender_id,
            label: g.gender,
          })),
        );

        setIntakeTypes(
          intakeData.map((i) => ({
            value: i.intake_type_id,
            label: i.intake_type,
          })),
        );

        setApprovalTypes(
          approvalData.map((a) => ({
            value: a.approval_type_id,
            label: a.approval_name,
          })),
        );

        setBehaviorTags(
          behaviorData.map((b) => ({
            value: b.tag_id,
            label: b.tag_name,
          })),
        );

        setLocationTypes(
          locationData.map((l) => ({
            value: l.location_type_id,
            label: l.location_name,
          })),
        );

        setRoleTypes(
          roleData.map((r) => ({
            value: r.role_id,
            label: r.role_name,
          })),
        );

        setSizes(
          sizeData.map((s) => ({
            value: s.size_id,
            label: s.size,
            order: s.sort_order,
          })),
        );

        setStates(
          stateData.map((s) => ({
            value: s.state_id,
            label: s.state_abbr,
          })),
        );

        setStatuses(
          statusData.map((s) => ({
            value: s.status_id,
            label: s.status,
          })),
        );

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading global data', err);
        setError('Failed to load reference data');
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  // expose the data for use in any page or component without prop-drilling

  return (
    <GlobalDataContext.Provider
      value={{
        breeds,
        genders,
        intakeTypes,
        approvalTypes,
        behaviorTags,
        locationTypes,
        roleTypes,
        sizes,
        states,
        statuses,
        isLoading,
        error,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);
