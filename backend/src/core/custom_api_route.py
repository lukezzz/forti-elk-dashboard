# fastapi 自定义Route Response Handle
# 统一格式化repsonse json格式
"""
{
    "success": False,
    "data": "",
    "errorMessage": exc.errors(),
    "traceId": traceId,
    "app": settings.app_title,
    }
"""
## 使用方式： from app.common.customAPIRoute import HandleResponseRoute
"""
router = APIRouter(
    route_class=HandleResponseRoute,
    prefix="/admin",
    tags=["admin_auth"],
    responses={404: {"detail": "Not found"}},
)
"""
## 异常处理

from typing import Callable
from fastapi import BackgroundTasks, Request, Response, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.routing import APIRoute
from fastapi.responses import JSONResponse
import json
from fastapi.encoders import jsonable_encoder

from core.settings import get_settings

settings = get_settings()


class HandleResponseRoute(APIRoute):
    def get_route_handler(self) -> Callable:
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> Response:
            try:
                response: Response = await original_route_handler(request)
                # 下面url bypass response格式化处理
                if request.url.path.endswith(
                    (
                        "export",

                    )
                ) or request.url.path.startswith("/aaa"):
                    return response
                else:
                    body = json.loads(response.body)
                    content = {
                        "success": True,
                        "data": body,
                        "errorMessage": "",
                    }
    
                    return JSONResponse(
                        content=content,
                        status_code=response.status_code,
                        background=response.background if response.background else None,
                    )
            # 异常分类
            except RequestValidationError as exc:
                content = {
                    "success": False,
                    "data": "",
                    "errorMessage": exc.errors(),
                    "traceId": "",
                    "app": settings.app_title,
                }
                return JSONResponse(
                    status_code=422,
                    content=jsonable_encoder(content),
                )
      
            except HTTPException as exc:
                status_code = exc.status_code
                errorMessage = exc.detail

                traceId = ""
                content = {
                    "success": False,
                    "data": "",
                    "errorMessage": errorMessage,
                }
                return JSONResponse(
                    content=content,
                    status_code=status_code,
                )
            # except Exception as e:

            #     traceId = ""
            #     content = {
            #         "success": False,
            #         "data": "",
            #         "errorMessage": str(e),
            #         "traceId": traceId,
            #         "app": settings.app_title,
            #     }
            #     return JSONResponse(
            #         content=content,
            #         status_code=400,
            #     )

        return custom_route_handler
