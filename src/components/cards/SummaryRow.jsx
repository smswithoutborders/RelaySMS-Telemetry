import PropTypes from 'prop-types';
import { Children } from 'react';

// material-ui
import Box from '@mui/material/Box';

// ==============================|| SUMMARY CARD ROW ||============================== //

// Phones: one swipeable row, each card about three quarters wide so the next one peeks in and shows there's more.
// Tablet up: a normal grid, `columns` across at lg (half that from sm).
export default function SummaryRow({ children, columns = 4, sx }) {
  return (
    <Box
      sx={[
        {
          display: { xs: 'flex', sm: 'grid' },
          gridTemplateColumns: { sm: `repeat(${Math.min(columns, 2)}, minmax(0, 1fr))`, lg: `repeat(${columns}, minmax(0, 1fr))` },
          gap: 2.75,
          overflowX: { xs: 'auto', sm: 'visible' },
          scrollSnapType: { xs: 'x mandatory', sm: 'none' },
          scrollPaddingInline: { xs: 16, sm: 0 },
          // Bleed to the screen edge on phones so the swipe reaches the edge, with the same inset for the first card.
          mx: { xs: -2, sm: 0 },
          px: { xs: 2, sm: 0 },
          pb: { xs: 0.5, sm: 0 },
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' }
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
    >
      {Children.map(children, (child) =>
        child ? (
          // Cards in a row share the tallest card's height.
          <Box
            sx={{ flex: { xs: '0 0 75%', sm: 'initial' }, minWidth: 0, scrollSnapAlign: 'start', display: 'flex', '& > *': { flex: 1 } }}
          >
            {child}
          </Box>
        ) : null
      )}
    </Box>
  );
}

SummaryRow.propTypes = {
  children: PropTypes.node,
  columns: PropTypes.number,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};
