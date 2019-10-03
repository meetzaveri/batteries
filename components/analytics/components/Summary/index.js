import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Row, Col, Icon } from 'antd';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { getAppAnalyticsSummaryByName } from '../../../../modules/selectors';
import { getAppAnalyticsSummary } from '../../../../modules/actions';
import Loader from '../../../shared/Loader/Spinner';
import { displayErrors } from '../../../../utils/heplers';
import Flex from '../../../shared/Flex';

const cardStyle = css`
	margin-bottom: 8px;
	background: rgba(229, 230, 233, 0.21);
	padding: 15px 0;
	p,
	h2 {
		margin: 0;
		text-align: center;
	}

	p {
		font-size: 1em;
		font-weight: bold;
		color: #8c8c8c;
	}

	h2 {
		color: #595959;
	}
`;

const cardContainer = css`
	padding: 10px;
`;

const SummaryCard = ({
 icon, title, count, style,
}) => (
	<Flex alignItems="center" justifyContent="center" style={style} className={cardStyle}>
		{/* {icon && (
			<div>
				<Icon type={icon} style={{ fontSize: '2.5em', marginRight: 15 }} />
			</div>
		)} */}
		<div>
			<p>{title}</p>
			<h2>{count}</h2>
		</div>
	</Flex>
);

class Summary extends React.Component {
	componentDidMount() {
		const { fetchAppAnalyticsSummary } = this.props;
		fetchAppAnalyticsSummary();
	}

	componentDidUpdate(prevProps) {
		const { errors } = this.props;
		displayErrors(errors, prevProps.errors);
	}

	render() {
		const {
			// prettier-ignore
			isLoading,
			avgClickRate,
			avgConversionRate,
			totalSearches,
			totalResults,
			noResultsRate,
			totalUsers,
			avgSuggestionClicks,
		} = this.props;
		if (isLoading) {
			return <Loader />;
		}
		return (
			<Row>
				<Col xl={8} md={12}>
					<Row gutter={8} className={cardContainer}>
						<Col span={24}>
							<SummaryCard
								icon="search"
								style={{ borderTop: '2px solid #2f54eb', background: '#f0f5ff' }}
								title="Total Searches"
								count={totalSearches}
							/>
						</Col>
						<Col sm={24} xs={24} xl={8}>
							<SummaryCard
								title="Total Users"
								style={{ background: '#f0f5ff' }}
								count={totalUsers}
							/>
						</Col>
						<Col sm={24} xs={24} xl={8}>
							<SummaryCard
								title="Impressions"
								count={totalResults}
								style={{ background: '#f0f5ff' }}
							/>
						</Col>
						<Col sm={24} xs={24} xl={8}>
							<SummaryCard
								title="No Results"
								count={noResultsRate}
								style={{ background: '#f0f5ff' }}
							/>
						</Col>
					</Row>
				</Col>
				<Col xl={8} md={12}>
					<Row gutter={8} className={cardContainer}>
						<Col span={24}>
							<SummaryCard
								icon="check"
								title="Clicks"
								style={{ borderTop: '2px solid #eb2f96', background: '#fff0f6' }}
								count={avgClickRate}
							/>
						</Col>
						<Col sm={24} xs={24} xl={12}>
							<SummaryCard
								title="Suggestion Clicks"
								style={{ background: '#fff0f6' }}
								count={avgSuggestionClicks}
							/>
						</Col>
						<Col sm={24} xs={24} xl={12}>
							<SummaryCard
								title="Result Clicks"
								style={{ background: '#fff0f6' }}
								count={avgClickRate - avgSuggestionClicks}
							/>
						</Col>
					</Row>
				</Col>
				<Col xl={8}>
					<Row gutter={8} className={cardContainer}>
						<Col span={24}>
							<SummaryCard
								icon="stock"
								style={{ background: '#f6ffed', borderTop: '2px solid #52c41a' }}
								title="Conversions"
								count={avgConversionRate}
							/>
						</Col>
					</Row>
				</Col>
			</Row>
		);
	}
}
Summary.propTypes = {
	fetchAppAnalyticsSummary: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	avgClickRate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	avgConversionRate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	totalSearches: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	errors: PropTypes.array.isRequired,
};
const mapStateToProps = (state) => {
	const appSummary = getAppAnalyticsSummaryByName(state);
	return {
		avgClickRate: get(appSummary, 'summary.avg_click_rate', 0),
		avgConversionRate: get(appSummary, 'summary.avg_conversion_rate', 0),
		avgSuggestionClicks: get(appSummary, 'summary.avg_suggestions_click_rate', 0),
		noResultsRate: get(appSummary, 'summary.no_results_rate', 0),
		totalSearches: get(appSummary, 'summary.total_searches', 0),
		totalUsers: get(appSummary, 'summary.total_users', 0),
		totalResults: get(appSummary, 'summary.total_results_count', 0),
		isLoading: get(state, '$getAppAnalyticsSummary.isFetching'),
		errors: [get(state, '$getAppAnalyticsSummary.error')],
	};
};
const mapDispatchToProps = dispatch => ({
	fetchAppAnalyticsSummary: appName => dispatch(getAppAnalyticsSummary(appName)),
});
export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Summary);
