import { Button, Grid, TextField } from '@material-ui/core';
import React, { useState } from 'react';

const SIZE = 9;

const FilterComponent = ({ applyFilters, initialValues } : any) => {
  const [filters, setFilters] = useState({
    search: initialValues.search || "",
    minPrice: initialValues.minPrice || "",
    maxPrice: initialValues.maxPrice || "",
  });

  const handleChange = (e : any) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSubmit = (e : any) => {
    e.preventDefault();
    applyFilters(filters);
  };

  return (
    <div className='flex justify-center content-center'>
      <Grid component="form" onSubmit={handleSubmit}>
        <Grid item xs={SIZE}>
          <TextField
            label="Search"
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={SIZE}>
          <TextField
            label="Min Price"
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={SIZE}>
          <TextField
            label="Max Price"
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={SIZE}>
          <Button type="submit" variant="contained" color="primary">
            Apply Filters
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default FilterComponent;
