import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getEquipmentDetail,
  initEquipmentDetail,
  initHistory,
} from 'redux/modules/equipmentStatus';
import styled from 'styled-components';
import Axios from 'api/axios';
import STRING, { REQUEST_PAGES } from 'constants/string';

import DetailImage from './DetailImage';
import DetailHeader from './DetailHeader';
import DetailBodyTitle from './DetailBodyTitle';
import DetailUseHistory from './DetailUseHistory';
import DetailInfoProduct from './DetailInfoProduct';
import DetailRepairHistory from './DetailRepairHistory';
import DetailInfoRequester from './DetailInfoRequester';
import { setRequestData } from 'redux/modules/requestStatus';
import ROUTER from 'constants/routerConst';

const axios = new Axios(process.env.REACT_APP_SERVER_URL);

const detailData = {
  largeCategory: '',
  categoryName: '',
  modelName: '',
  serialNum: '',
  partnersId: '',
  deptId: '',
  userId: '',
  useType: '',
  image: '',
};

export default function EquipmentDetail({
  isAdmin,
  category,
  largeCategory,
  detailId,
  isClose,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [editRequester, setEditRequester] = useState({
    category: false,
    partners: false,
    deptUser: false,
  });
  const [dept, setDept] = useState(null);
  const [user, setUser] = useState('');
  const [imageForm, setImageForm] = useState(null);
  const [preview, setPreview] = useState('');
  const [partners, setPartners] = useState('');
  const [smallCategory, setSmallCategory] = useState(null);
  const parseLargeCategory = useRef(largeCategory.filter((_, i) => i)).current;
  const [optionNullList, setOptionNullList] = useState({
    partners: '회사명',
    dept: '부서명',
    user: '공용',
  });

  const { getDetail, isDetailError } = useSelector(
    state => state.equipmentStatus.equipmentDetail
  );

  useEffect(() => {
    const path = isAdmin ? '/admin' : '';
    dispatch(initHistory());
    dispatch(initEquipmentDetail());
    dispatch(getEquipmentDetail({ path, supplyId: detailId }));

    axios
      .get(`/api/dept`)
      .then(res =>
        setDept([{ deptId: '', deptName: '선택 안함' }, ...res.data.data])
      );
    axios
      .get(`/api/partners`)
      .then(res =>
        setPartners([
          { partnersId: '', partnersName: '선택 안함' },
          ...res.data.data,
        ])
      );
  }, [detailId, dispatch]);

  const handleEdit = () => setEdit(true);

  const handleEditRequester = e => {
    const value = e.target.value;
    setEditRequester({ ...editRequester, [value]: !editRequester[value] });
  };

  const handleSave = supplyId => {
    const {
      largeCategory,
      category,
      partnersId,
      userId,
      image,
      modelName,
      serialNum,
    } = getDetail.supplyDetail;

    detailData.largeCategory = STRING.CATEGORY[largeCategory];
    detailData.categoryName = category;
    detailData.modelName = modelName;
    detailData.serialNum = serialNum;

    partnersId && !detailData.partnersId && (detailData.partnersId = '');
    detailData.userId || (detailData.userId = userId || '');

    detailData.deptId && (detailData.useType = STRING.USE_TYPE['공용']);
    detailData.userId && (detailData.useType = STRING.USE_TYPE['개인']);
    !detailData.deptId && (detailData.useType = '');

    detailData.image || (detailData.image = image);

    sendFormData(supplyId, image);
  };

  const handleDispose = supplyId => {
    axios.delete(`/api/supply/${supplyId}`).then(() => isClose());
  };

  const handleFromRequest = e => {
    const { value } = e.target;
    dispatch(setRequestData(REQUEST_PAGES[value]));
    navigate(ROUTER.PATH.USER.REQUEST);
  };

  const handleChangePartners = e => {
    const { ko: partners } = JSON.parse(e.target.value);
    const text = e.target.options[e.target.selectedIndex].innerText;

    setOptionNullList(state => ({ ...state, partners: text }));
    detailData.partnersId = partners;
  };

  const handleChangeDept = e => {
    const { ko: dept } = JSON.parse(e.target.value);
    const text = e.target.options[e.target.selectedIndex].innerText;
    setOptionNullList(state => ({ ...state, dept: text, user: '공용' }));

    dept && getUserData(dept);
    detailData.deptId = dept;
    detailData.userId = '';
    console.log(detailData.userId);
  };

  const handleChangeUser = e => {
    const { ko: user } = JSON.parse(e.target.value);
    const text = e.target.options[e.target.selectedIndex].innerText;
    setOptionNullList(state => ({ ...state, user: text }));

    detailData.userId = user;
  };

  const getUserData = deptId =>
    axios.get(`/api/user/${deptId}`).then(res => setUser(res.data.data));

  const sendFormData = (supplyId, image) => {
    const formData = new FormData();
    formData.append('largeCategory', detailData.largeCategory);
    formData.append('categoryName', detailData.categoryName);
    formData.append('modelName', detailData.modelName);
    formData.append('serialNum', detailData.serialNum);
    formData.append('partnersId', detailData.partnersId);
    formData.append('userId', detailData.userId);
    formData.append('deptId', detailData.deptId);
    formData.append('useType', detailData.useType);

    if (imageForm) {
      formData.append('multipartFile', imageForm);
    } else {
      formData.append('image', image);
    }
    sendEditData(supplyId, formData);
  };

  const sendEditData = (supplyId, formData) =>
    axios.put(`/api/supply/${supplyId}`, formData).then(() => isClose());

  const handleChangeimge = e => {
    const img = e.target.files[0];
    setImageForm(img);
    setPreviewImage(img);
  };

  const setPreviewImage = img => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(img);
  };

  return (
    <>
      {isDetailError && <div>에러가 발생했습니다.</div>}
      {getDetail && (
        <DetailWrapper>
          <DetailHeader
            edit={edit}
            detail={getDetail}
            onEdit={handleEdit}
            onSave={handleSave}
            onDispose={handleDispose}
            onFromRequest={handleFromRequest}
          />
          <DetailBodyTitle detail={getDetail} />
          <DetailBodyContainer>
            <DetailImage
              detail={getDetail}
              preview={preview}
              onChangeImage={handleChangeimge}
            />
            <div>
              <DetailInfoContainer>
                <DetailInfo>
                  <DetailInfoProduct edit={edit} detail={getDetail} />
                  <DetailInfoRequester
                    edit={edit}
                    optionNullList={optionNullList}
                    editRequester={editRequester}
                    deptValue={[dept, user]}
                    detail={getDetail}
                    partners={partners}
                    onChangeDept={[handleChangeDept, handleChangeUser]}
                    onChangePartners={handleChangePartners}
                    onEditRequester={handleEditRequester}
                  />
                </DetailInfo>
              </DetailInfoContainer>
              <History>
                <DetailUseHistory detail={getDetail} />
                <DetailRepairHistory detail={getDetail} />
              </History>
            </div>
          </DetailBodyContainer>
        </DetailWrapper>
      )}
    </>
  );
}

const DetailWrapper = styled.main`
  ${props => props.theme.flexCol}
  padding: 0 6.375rem;
`;

const DetailBodyContainer = styled.section`
  display: flex;
`;

const DetailInfoContainer = styled.div`
  display: flex;
`;

const DetailInfo = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.color.grey.brandColor2};
  gap: 2.875rem;
`;

const History = styled.div`
  display: flex;
  gap: 3.125rem;
`;
