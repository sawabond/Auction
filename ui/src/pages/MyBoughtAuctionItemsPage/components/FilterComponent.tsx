import { Button, Grid, TextField } from '@material-ui/core';
import React, { useState } from 'react';

const FilterComponent = ({ applyFilters } : any) => {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    search: '',
    minPrice: '',
    maxPrice: '',
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
      <Grid xs={9} component="form" onSubmit={handleSubmit}>
        <Grid item>
          <TextField
            label="Page"
            type="number"
            name="page"
            value={filters.page}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item>
          <TextField
            label="Page Size"
            type="number"
            name="pageSize"
            value={filters.pageSize}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item>
          <TextField
            label="Search"
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item>
          <TextField
            label="Min Price"
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item>
          <TextField
            label="Max Price"
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item>
          <Button type="submit" variant="contained" color="primary">
            Apply Filters
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default FilterComponent;
