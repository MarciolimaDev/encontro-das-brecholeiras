from django.urls import path

from .views import (
    admin_dashboard,
    admin_brand_detail,
    admin_brands,
    admin_event_detail,
    admin_events,
    admin_login,
    admin_me,
    admin_member_application_status,
    admin_members,
    admin_product_categories,
    admin_product_category_detail,
    shop_login,
    shop_me,
    shop_account,
    shop_product_detail,
    shop_products,
    shop_settings,
)

app_name = "accounts"

urlpatterns = [
    path("auth/admin/login/", admin_login, name="admin-login"),
    path("auth/admin/me/", admin_me, name="admin-me"),
    path("auth/shop/login/", shop_login, name="shop-login"),
    path("auth/shop/me/", shop_me, name="shop-me"),
    path("shop/<slug:slug>/account/", shop_account, name="shop-account"),
    path("shop/<slug:slug>/products/", shop_products, name="shop-products"),
    path("shop/<slug:slug>/products/<int:product_id>/", shop_product_detail, name="shop-product-detail"),
    path("shop/<slug:slug>/settings/", shop_settings, name="shop-settings"),
    path("admin/dashboard/", admin_dashboard, name="admin-dashboard"),
    path("admin/brands/", admin_brands, name="admin-brands"),
    path("admin/brands/<int:brand_id>/", admin_brand_detail, name="admin-brand-detail"),
    path("admin/categories/", admin_product_categories, name="admin-product-categories"),
    path("admin/categories/<int:category_id>/", admin_product_category_detail, name="admin-product-category-detail"),
    path("admin/events/", admin_events, name="admin-events"),
    path("admin/events/<uuid:event_id>/", admin_event_detail, name="admin-event-detail"),
    path("admin/members/", admin_members, name="admin-members"),
    path(
        "admin/member-applications/<int:application_id>/",
        admin_member_application_status,
        name="admin-member-application-status",
    ),
]
