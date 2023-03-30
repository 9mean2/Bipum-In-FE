import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { __dashboardStatus } from '../../redux/modules/dashboardStatus';
import { getCategoryList } from '../../redux/modules/equipmentStatus';
import ScrollToTop from '../../components/common/ScrollToTop';
import ManagementStatus from '../../components/adminDashBoard/status/ManagementStatus';
import AlertStatus from '../../components/adminDashBoard/status/AlertStatus';
import TestStatus from '../../components/adminDashBoard/status/UseageCard';
import CategoryStatus from '../../components/adminDashBoard/status/CategoryStatus';
import UserDashboardDetailModal from '../../components/adminDashBoard/UserDashboardDetailModal';

export default function UserDashBoard() {
  const isAdmin = false;
  const dispatch = useDispatch();
  const [status, setStatus] = useState('');
  const [showDetailModal, setShowDetailModal] = useState({
    show: false,
    id: null,
  });
  const { getDashboard, isDashboardError } = useSelector(
    state => state.dashboardStatus.dashboardStatus
  );

  useEffect(() => {
    dispatch(__dashboardStatus({ path: '', status }));
    dispatch(getCategoryList());
  }, [dispatch, status]);

  const handleDetailModal = id =>
    setShowDetailModal(state => ({ show: !state.show, id: id }));

  return (
    <>
      {isDashboardError && <div>에러 발생</div>}
      {getDashboard && (
        <UserDashBoardWrapper id="scrollable-div">
          <TopSideContainer>
            <ManagementStatus isAdmin={isAdmin} getDashboard={getDashboard} />
            <AlertStatus />
            <TestStatus />
          </TopSideContainer>
          <BottomSideContainer>
            <CategoryStatus
              isAdmin={isAdmin}
              setStatus={setStatus}
              getDashboard={getDashboard}
              onDetailModal={handleDetailModal}
            />
          </BottomSideContainer>
          <ScrollToTop targetSelector="#scrollable-div" />
        </UserDashBoardWrapper>
      )}
      <UserDashboardDetailModal
        isAdmin={isAdmin}
        showDetailModal={showDetailModal}
        onDetailModal={handleDetailModal}
      />
    </>
  );
}

const UserDashBoardWrapper = styled.div`
  ${props => props.theme.FlexCol};
  height: calc(100vh - 6.25rem);
  overflow: auto;
  margin: -3rem -3.75rem;
  padding: 3.75rem 0px 3.75rem 3.75rem;
`;

const TopSideContainer = styled.div`
  ${props => props.theme.FlexRow};
  width: 100%;
  padding: 0 3.25rem 2.5rem 0;
  gap: 3.5rem;

  @media (max-width: ${props => props.theme.screen.dashboardDesktopMaxWidth}) {
    ${props => props.theme.FlexCol};
    flex-wrap: wrap;
  }
`;

const BottomSideContainer = styled.div`
  position: relative;
  ${props => props.theme.FlexCol};
  align-items: flex-start;
  width: 100%;
  padding-right: 3.25rem;
`;
