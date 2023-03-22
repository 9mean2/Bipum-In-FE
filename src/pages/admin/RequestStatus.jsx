import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import StatusMenu from '../../components/common/status/StatusMenu';
import RequestShow from '../../components/requestStatus/RequestShow';

import useSelectMenu from '../../hooks/useSelectMenu';
import useSetStateChange from '../../hooks/useSetStateChange';
import useResizeGetPageSize from '../../hooks/useResizeGetPageSize';

import { useDispatch, useSelector } from 'react-redux';
import { __requestStatus } from '../../redux/modules/requestStatus';
import { useLocation } from 'react-router-dom';

const menuData = [
  { name: '전체', type: 'ALL', status: true },
  { name: '비품 요청', type: 'SUPPLY', status: false },
  { name: '반납 요청', type: 'RETURN', status: false },
  { name: '수리 요청', type: 'REPAIR', status: false },
  { name: '보고서 결재', type: 'REPORT', status: false },
];

export default function RequestStatus() {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [type, setType] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [keyword, setKeyword] = useState('');
  const selectBoxRef = useRef();

  const [menuStyle, clickMenu, setSelectName] = useSelectMenu(menuData);
  const [resizeRef, pageSize, firstPageSize, handleResize] =
    useResizeGetPageSize();

  const { getRequest, isStatusError } = useSelector(
    state => state.requestStatus.requestStatus
  );

  useEffect(() => {
    if (state === 'UNPROCESSED') {
      setStatus(state.status);
    }
  }, [state]);

  useEffect(() => {
    const size = pageSize || firstPageSize || handleResize();
    dispatch(__requestStatus({ keyword, type, status, page, size }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, keyword, page, type, status, pageSize, handleResize]);

  const handleClickMenu = useSetStateChange(
    ['전체', '비품 요청', '반납 요청', '수리 요청', '보고서 결재'],
    ['ALL', 'SUPPLY', 'RETURN', 'REPAIR', 'REPORT'],
    setType,
    e => {
      clickMenu(e);
      setPage(1);
      setKeyword('');
    }
  );

  const handlePage = e => {
    setPage(e);
  };

  return (
    <>
      {isStatusError && <div>에러 발생</div>}
      <RequestStatusWrapper ref={resizeRef.containerRef}>
        <StatusMenu
          headerRef={resizeRef.headerRef}
          menuStyle={menuStyle}
          onClickMenu={handleClickMenu}
        />
        <RequestShow
          requestData={getRequest}
          setSelectName={setSelectName}
          page={page}
          pageSize={pageSize || firstPageSize}
          onPage={handlePage}
          status={status}
          setStatus={setStatus}
          keyword={keyword}
          setKeyword={setKeyword}
          resizeRef={resizeRef}
          selectBoxRef={selectBoxRef}
        />
      </RequestStatusWrapper>
    </>
  );
}

const RequestStatusWrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
