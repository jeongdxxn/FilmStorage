import React, { useState } from "react";
import styled, { css } from "styled-components";
import FilmType from "./FilmType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import FilmLogLocation from "./FilmLogLocation";

export default function FilmLogWriting({ userInfo, setIsOpen }) {
  // 유저 정보 상태 관리
  const [photoInfo, setPhotoInfo] = useState({
    photo: {},
    type: "",
    contents: "",
  });
  // 위치 정보 상태 관리
  const [inputText, setInputText] = useState("");
  const [place, setPlace] = useState("");

  // 선택된 장소
  const [clickLocation, setClickLocation] = useState({});

  console.log(clickLocation);

  const onChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlace(inputText);
    setInputText("");
  };

  // 이미지 미리보는 상태
  const [files, setFiles] = useState("");

  // 이미지 미리보기 삽입 기능
  const encodeFileTobase64 = (fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve) => {
      reader.onload = () => {
        setFiles(reader.result);
        setPhotoInfo({ ...photoInfo, photo: fileBlob });
        resolve();
      };
    });
  };
  // 이미지 수정 버튼
  const handleRevison = () => {
    setFiles("");
    setPhotoInfo({ ...photoInfo, photo: "" });
  };

  // 내용 상태 관리 함수
  const handleContents = (e) => {
    setPhotoInfo({ ...photoInfo, contents: e.target.value });
  };

  const filmlogRegister = () => {
    const postData = { filmtype: photoInfo.type, contents: photoInfo.contents };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/filmlogs/register/${userInfo.id}`,
        postData,
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      )
      .then((res) => {
        const { id } = res.data.data;
        const formData = new FormData();
        formData.set("photo", photoInfo.photo);
        // console.log("폼데이터 확인", formData);
        axios
          .patch(
            `${process.env.REACT_APP_API_URL}/filmlogs/revision/photo/${userInfo.id}/${id}`,
            formData,
            {
              headers: {
                "Content-type": "multipart/form-data",
              },
            }
          )
          .then((res) => {
            alert("등록이 완료되었습니다");
            // isOpen 상태 변경 / setIsOpen(true)// 상위에서 props로 전달받아 적용
            setIsOpen(false);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
        alert("서버 연결이 불안정 합니다.");
      });
  };

  return (
    <>
      <ModalBG onClick={() => setIsOpen()}>
        <ModalBox onClick={(e) => e.stopPropagation()}>
          <ModalNav>
            <div className="navtitle">
              <Button onClick={() => setIsOpen()}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </Button>
            </div>
            <div className="navtitle">사진 등록 하기</div>
            <div className="navtitle">
              <Button onClick={() => handleRevison()}>수정</Button>
              <Button onClick={() => filmlogRegister()}>등록</Button>
            </div>
          </ModalNav>
          <ModalImageBox>
            <ImageBox>
              {files && (
                <img
                  src={files}
                  alt="preview-img"
                  width="100%"
                  height="100%"
                  border-bottom-left-radius="1rem"
                  object-fit="cover"
                />
              )}
              <div className="imginsert">
                사진을 <br />
                등록 해주세요.
              </div>
              <Label>
                업로드
                <input
                  className="upload"
                  type="file"
                  accept="image/*"
                  required="true"
                  onChange={(e) => {
                    encodeFileTobase64(e.target.files[0]);
                  }}
                ></input>
              </Label>
            </ImageBox>
            <Content>
              <UserInfo>
                <div className="userinfo">
                  <UserImg src={userInfo.profile} />
                </div>
                <div className="userinfo">{userInfo.nickname}</div>
              </UserInfo>
              <Tagarea>
                필름선택
                <FilmType setPhotoInfo={setPhotoInfo} photoInfo={photoInfo} />
              </Tagarea>
              <Textarea>
                <textarea
                  className="filmcontent"
                  placeholder="내용입력"
                  onChange={handleContents}
                ></textarea>
              </Textarea>
              <LocationSearch>
                <div className="searchTitle">장소선택</div>
                <Search>
                  <form onSubmit={handleSubmit}>
                    <input
                      placeholder="Search Place..."
                      onChange={onChange}
                      value={inputText}
                    />
                  </form>
                </Search>
                <ChoiceBox>{clickLocation.Location}</ChoiceBox>
              </LocationSearch>
              <LocationArea>
                <FilmLogLocation
                  place={place}
                  setClickLocation={setClickLocation}
                />
              </LocationArea>
            </Content>
          </ModalImageBox>
        </ModalBox>
      </ModalBG>
    </>
  );
}

const ModalBG = styled.div`
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
`;

const ModalBox = styled.div.attrs((props) => ({
  role: "dialog",
}))`
  width: 70vw;
  height: 80vh;
  background: white;
  border-radius: 1rem;
  margin: 0;
`;

const ModalNav = styled.nav`
  width: 70vw;
  height: 10vh;
  border-bottom: 1px solid black;
  display: flex;
  font-size: 2rem;
  text-align: center;
  justify-content: space-between;
  > div.navtitle {
    margin-top: 1.3rem;
    margin-right: 2rem;
    margin-left: 2rem;
  }
`;

const ModalImageBox = styled.div`
  display: flex;
  width: 70vw;
  height: 70vh;
  /* border: 1px solid black; */
`;

const ImageBox = styled.div`
  width: 40vw;
  border-right: 1px solid black;
  text-align: center;
  > div.imginsert {
    margin-top: 15rem;
    margin-bottom: 1rem;
  }
`;

const Button = styled.button`
  padding: 10px 30px;
  border: none;
  border-radius: 20px;
  margin-left: 10px;
  right: ${(props) => props.rigth || 0};
  ${(props) => {
    if (props.top) {
      return css`
        top: -50px;
      `;
    } else if (props.bottom) {
      return css`
        bottom: -50px;
      `;
    }
  }}
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    color: white;
    background: tomato;
    transition: 0.3s;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  background: #eee;
  padding: 10px 30px;
  border: none;
  border-radius: 20px;
  right: ${(props) => props.rigth || 0};
  ${(props) => {
    if (props.top) {
      return css`
        top: -50px;
      `;
    } else if (props.bottom) {
      return css`
        bottom: -50px;
      `;
    }
  }}
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    color: white;
    background: tomato;
    transition: 0.3s;
  }
  > input.upload {
    display: none;
  }
`;

const UserInfo = styled.div`
  /* border: 1px solid red; */
  width: 30vw;
  height: 10vh;
  display: flex;
  > div.userinfo {
    margin-top: 1.7rem;
    margin-left: 1rem;
    margin-bottom: 1.7rem;
    /* border: 1px solid blue; */
    font-size: 1.5rem;
  }
`;

const Textarea = styled.div`
  width: 30vw;
  height: 30vh;
  margin-left: 1rem;
  margin-right: 1rem;
  /* border: 1px solid blue; */
  > textarea.filmcontent {
    width: 29.5vw;
    height: 10vh;
    rows: "5";
    cols: "30";
    placeholder: "내용 입력";
  }
`;

const Tagarea = styled.div`
  width: 30vw;
  margin-left: 1rem;
  margin-bottom: 1rem;
  /* border: 1px solid green; */
`;

const UserImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #eee;
  background: #eee;
  object-fit: cover;
`;

const LocationArea = styled.div`
  width: 30vw;
  height: 100%;
  margin: 1rem;
  margin-top: 0;
`;

const LocationSearch = styled.div`
  width: 30vw;
  height: 30px;
  display: flex;
  /* justify-content: space-between; */
  margin: 1rem;
  margin-bottom: 0.5rem;
  > div.searchTitle {
    width: 5vw;
  }
`;

const Search = styled.div`
  /* border: 1px solid green; */
  /* width: 100%; */
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ChoiceBox = styled.div`
  border: 1px solid green;
  width: 200px;
  margin-left: 1rem;
`;
