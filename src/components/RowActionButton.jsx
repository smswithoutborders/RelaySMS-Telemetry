import { forwardRef } from 'react';
import IconButton from '@mui/material/IconButton';

// ==============================|| ROW ACTION BUTTON ||============================== //

const RowActionButton = forwardRef(function RowActionButton({ sx, ...props }, ref) {
  return (
    <IconButton
      ref={ref}
      size="small"
      sx={{
        fontSize: '1rem',
        color: 'text.primary',
        border: 1,
        borderColor: 'divider',
        '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
        ...sx
      }}
      {...props}
    />
  );
});

export default RowActionButton;
