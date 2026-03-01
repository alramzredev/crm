import React, { useMemo } from 'react';
import SelectInput from '@/Shared/SelectInput';
import { useTranslation } from 'react-i18next';

const CityMunicipalityNeighborhoodSelector = ({
  data,
  setData,
  errors = {},
  cities = [],
  municipalities = [],
  neighborhoods = [],
  showCity = true,
  showMunicipality = true,
  showNeighborhood = true,
  cityLabel,
  municipalityLabel,
  neighborhoodLabel,
}) => {
  const { t } = useTranslation();
  // Filter municipalities by selected city
  const filteredMunicipalities = useMemo(() => {
    if (!data.city_id) return municipalities;
    return municipalities.filter(m => String(m.city_id) === String(data.city_id));
  }, [data.city_id, municipalities]);

  // Filter neighborhoods by selected municipality
  const filteredNeighborhoods = useMemo(() => {
    if (!data.municipality_id) return neighborhoods;
    return neighborhoods.filter(n => String(n.municipality_id) === String(data.municipality_id));
  }, [data.municipality_id, neighborhoods]);

  const handleCityChange = (value) => {
    setData('city_id', value);
    setData('municipality_id', '');
    setData('neighborhood_id', '');
  };

  const handleMunicipalityChange = (value) => {
    setData('municipality_id', value);
    setData('neighborhood_id', '');
  };

  return (
    <>
      {showCity && (
        <SelectInput
          className="w-full pb-8 pr-6 lg:w-1/3"
          label={cityLabel || t('city')}
          name="city_id"
          errors={errors.city_id}
          value={data.city_id || ''}
          onChange={e => handleCityChange(e.target.value)}
        >
          <option value=""></option>
          {cities.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </SelectInput>
      )}

      {showMunicipality && (
        <SelectInput
          className="w-full pb-8 pr-6 lg:w-1/3"
          label={municipalityLabel || t('municipality')}
          name="municipality_id"
          errors={errors.municipality_id}
          value={data.municipality_id || ''}
          onChange={e => handleMunicipalityChange(e.target.value)}
          disabled={!data.city_id}
        >
          <option value=""></option>
          {filteredMunicipalities.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </SelectInput>
      )}

      {showNeighborhood && (
        <SelectInput
          className="w-full pb-8 pr-6 lg:w-1/3"
          label={neighborhoodLabel || t('neighborhood')}
          name="neighborhood_id"
          errors={errors.neighborhood_id}
          value={data.neighborhood_id || ''}
          onChange={e => setData('neighborhood_id', e.target.value)}
          disabled={!data.municipality_id}
        >
          <option value=""></option>
          {filteredNeighborhoods.map(n => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </SelectInput>
      )}
    </>
  );
};

export default CityMunicipalityNeighborhoodSelector;
