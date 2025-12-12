# Internet Shutdown Early Warning System

## Overview

The Internet Shutdown Early Warning System is an advanced anomaly detection feature that monitors user signup patterns to identify potential internet shutdowns or spam attacks. This feature is critical because **RelaySMS is a preparedness tool** - people sign up when they anticipate connectivity issues.

## Key Concept

Unlike traditional analytics where increased signups indicate growth, in RelaySMS:
- **Sudden signup spikes** = Potential impending internet shutdown
- **High retention after spike** = Legitimate shutdown preparation
- **Low retention after spike** = Possible spam/bot attack

## Features

### 1. Signup Spike Detection
- Monitors signups by country and date
- Compares current period to 7-day baseline
- Triggers alerts when signups increase by **200%+ or 100%+ with 50+ new signups**
- Considers both percentage change and absolute numbers

### 2. Retention Validation
Distinguishes between real concerns and spam by analyzing user retention:

```
High Retention (≥50%) = Legitimate users preparing for shutdown
Low Retention (<50%) = Possible spam/bot attack
```

### 3. Alert Levels

#### Critical (Red) - Spam Detection
- **Criteria**: Signup spike + retention rate <50%
- **Meaning**: Possible spam or bot attack
- **Action**: Investigate accounts, increase signup verification
- **Confidence**: ~75%

#### High Risk (Orange) - Likely Shutdown
- **Criteria**: Signup spike + retention rate ≥70%
- **Meaning**: Legitimate shutdown preparation
- **Action**: Monitor closely, prepare infrastructure
- **Confidence**: 80-95%

#### Medium Risk (Blue) - Monitor
- **Criteria**: Signup spike + retention rate 50-69%
- **Meaning**: Moderate activity, unclear intent
- **Action**: Watch for pattern confirmation
- **Confidence**: 50-80%

#### Low Risk (Green) - Minor Spike
- **Criteria**: Signup spike + retention rate 0-49% but above spam threshold
- **Meaning**: Possible organic growth or minor concern
- **Action**: Continue monitoring
- **Confidence**: 30-50%

### 4. Summary Metrics Dashboard

Four key metric cards show at a glance:
- **Critical Alerts**: Possible spam attacks requiring immediate investigation
- **High Risk Alerts**: Likely shutdown preparation events
- **Medium Risk Alerts**: Situations requiring close monitoring
- **Total Countries Monitored**: Countries with active signup data

### 5. Two View Modes

#### Alert Dashboard View
- Shows all active alerts with detailed information
- Color-coded severity levels
- Key metrics for each country:
  - Current signup count
  - Baseline (7-day average)
  - Percentage change
  - Retention rate
  - Confidence score

#### Timeline View
- Visual line charts for top 10 countries
- Shows signup trends over the selected period
- Helps identify patterns and trends
- Useful for comparing historical data

## How It Works

### Detection Algorithm

```javascript
1. Fetch baseline data (7 days before current period)
2. Fetch current period data
3. Fetch retention data
4. For each country:
   a. Calculate current total signups
   b. Calculate baseline average
   c. Calculate percentage change
   d. If spike detected (>200% or >100% with 50+ new signups):
      - Calculate retention rate
      - Classify alert level based on retention
      - Assign confidence score
      - Generate alert message
5. Sort alerts by severity and percentage change
6. Display in dashboard
```

### Retention Rate Calculation

```javascript
Retention Rate = (Retained Users / Total Signups) × 100

Example:
- Country X had 300 signups in current period
- 210 of those users were retained (active)
- Retention Rate = (210 / 300) × 100 = 70%
- Classification: High Risk (likely shutdown prep)
```

### Confidence Score

The confidence score is calculated based on:
- Retention rate percentage
- Magnitude of signup spike
- Historical patterns

```javascript
For High Retention (≥50%):
  confidence = 50 + (retention_rate / 2)
  Range: 75-95%

For Low Retention (<50%):
  confidence = 30 + retention_rate
  Range: 30-80%

For Spam Detection:
  confidence = fixed 75%
```

## Use Cases

### 1. Shutdown Preparation
**Scenario**: Cameroon shows 340% signup spike with 72% retention

**Interpretation**: 
- High confidence this is legitimate shutdown preparation
- Users are actually using the service
- Likely an impending or ongoing internet shutdown

**Actions**:
- Alert operations team to prepare infrastructure
- Monitor publication volume shifts (internet → SMS)
- Document the event for advocacy groups
- Consider reaching out to affected users

### 2. Spam Detection
**Scenario**: Ethiopia shows 250% signup spike with 15% retention

**Interpretation**:
- Users signing up but not using the service
- Likely bot attack or coordinated fake signups
- Low confidence in legitimate use

**Actions**:
- Flag accounts for review
- Check for patterns (same IP, device, timing)
- Temporarily increase signup verification requirements
- Clean up inactive accounts

### 3. Regional Monitoring
**Scenario**: Multiple countries in West Africa showing moderate spikes

**Interpretation**:
- Could indicate regional political instability
- Users preparing for possible shutdowns
- Pattern suggests real concerns

**Actions**:
- Monitor news and social media
- Prepare for increased load
- Coordinate with advocacy organizations
- Document patterns for reports

## Data Sources

### API Endpoints Used

1. **Signup Data**
   - Endpoint: `/signup`
   - Parameters: `category=signup`, `group_by=country`, `granularity=day`
   - Used for: Baseline and current period comparison

2. **Retention Data**
   - Endpoint: `/retained`
   - Parameters: `category=retained`, `group_by=country`, `granularity=day`
   - Used for: Validation of user legitimacy

### Date Ranges

- **Baseline Period**: 7 days before the selected start date
- **Current Period**: User-selected date range (default: last 30 days)
- **Comparison**: Current period compared to baseline to detect anomalies

## Integration

### Dashboard Integration

The component is added to the main dashboard page:

```jsx
import ShutdownEarlyWarning from 'sections/dashboard/default/ShutdownEarlyWarning';

// In dashboard render
<Grid size={12} sx={{ mb: 4 }}>
  <ShutdownEarlyWarning filters={filtersApplied} />
</Grid>
```

### Filter Support

The component respects dashboard filters:
- **Date Range**: Changes baseline and current periods
- **Country Filter**: Focuses on specific country
- Other filters don't apply to signup/retention data

## Interpreting Results

### Example Alert Breakdown

```
🇨🇲 Cameroon (CM) - HIGH RISK ALERT
─────────────────────────────────────
Message: Possible shutdown preparation - Users actively using service
Confidence: 86%

Metrics:
├─ Current Signups: 1,230 ↑
├─ Baseline (7-day): 285
├─ Change: +331.6%
└─ Retention: 72% ✓

Interpretation:
This is likely a legitimate response to anticipated internet restrictions.
The high retention rate (72%) indicates users are genuinely concerned
and actively using the service.
```

### Reading Timeline Charts

- **Flat line**: Normal, stable activity
- **Gradual increase**: Organic growth
- **Sharp spike**: Anomaly requiring investigation
- **Drop after spike**: May indicate shutdown ended or spam cleaned up

## Best Practices

### 1. Regular Monitoring
- Check dashboard daily during high-risk periods
- Set up alerts for High Risk and Critical levels
- Review trends weekly to identify patterns

### 2. Context Awareness
- Cross-reference with news and social media
- Consider regional political situations
- Look for patterns across neighboring countries

### 3. Response Planning
- Document all detected events
- Maintain contact list for advocacy groups
- Have infrastructure scaling plan ready
- Prepare user communication templates

### 4. False Positive Management
- Investigate all Critical alerts promptly
- Verify High Risk alerts with external sources
- Adjust thresholds based on historical data
- Document false positives for algorithm improvement

## Limitations

1. **Requires Historical Data**: Needs at least 7 days of baseline data
2. **Retention Lag**: Retention data may lag by days
3. **Cannot Predict**: Only detects preparation, not actual shutdowns
4. **Regional Variations**: Thresholds may need adjustment per region
5. **External Factors**: Legitimate growth can trigger false positives

## Future Enhancements

### Planned Improvements
1. Machine learning model trained on historical shutdown data
2. Integration with external shutdown tracking APIs
3. Automated notifications via email/webhook
4. SMS vs. Internet publication routing analysis
5. Historical shutdown archive
6. Multi-factor confidence scoring
7. Real-time monitoring mode
8. Export reports for advocacy use

### Suggested Thresholds Adjustment
- Consider country-specific baselines
- Adjust spike threshold based on country size
- Weight recent history more than older data
- Add time-of-day patterns

## Technical Details

### Component Location
`src/sections/dashboard/default/ShutdownEarlyWarning.jsx`

### Key Functions

1. **fetchSignupData**: Retrieves signup data from API
2. **fetchRetainedData**: Retrieves retention data from API
3. **calculateRetentionRate**: Computes retention percentage per country
4. **detectAnomalies**: Main detection algorithm
5. **processTimelineData**: Prepares data for visualization

### Dependencies
- Material-UI components
- @mui/x-charts for LineChart
- axios for API calls
- dayjs for date manipulation

### State Management
- `alerts`: Array of detected anomalies
- `countryTimelines`: Timeline data for visualization
- `loading`: Loading state
- `view`: Current view mode (alerts/timeline)

## Support

For questions or issues:
1. Check documentation in the app (Help section)
2. Review this technical guide
3. Contact development team
4. Submit issue on GitHub

## Changelog

### Version 1.0.0 (December 2025)
- Initial release
- Signup spike detection
- Retention validation
- Alert classification system
- Dual view mode (alerts/timelines)
- Summary metrics dashboard
- Integration with dashboard filters

---

**Note**: This feature is critical for RelaySMS operations. Regular monitoring and prompt investigation of alerts can help identify both security threats (spam) and human rights concerns (shutdowns).
